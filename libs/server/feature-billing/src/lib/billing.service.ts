import { PrismaService } from '@gps/data-access-db';
import {
  FeePlan,
  Invoice,
  InvoiceStatus,
  Payment,
  PaymentStatus,
  Prisma,
} from '@gps/data-access-prisma';
import { apiConflict, apiNotFound, apiUnprocessable } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateFeePlanDto } from './dto/create-fee-plan.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FeePlanResponseDto } from './dto/fee-plan-response.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { ListFeePlansQueryDto } from './dto/list-fee-plans-query.dto';
import { ListInvoicesQueryDto } from './dto/list-invoices-query.dto';
import { ListPaymentsQueryDto } from './dto/list-payments-query.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { UpdateFeePlanDto } from './dto/update-fee-plan.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FeeDiscountType } from './dto/fee-item-discount-input.dto';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async listFeePlans(user: AuthenticatedUser, query: ListFeePlansQueryDto) {
    const rows = await this.prisma.feePlan.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}),
        ...(query.isActive !== undefined ? { isActive: query.isActive === 'true' } : {}),
      },
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: [{ code: 'asc' }],
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toFeePlanResponse(row));
  }

  async createFeePlan(user: AuthenticatedUser, dto: CreateFeePlanDto) {
    const duplicate = await this.prisma.feePlan.findFirst({
      where: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        academicYearId: dto.academicYearId,
        name: dto.name,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (duplicate) {
      throw apiConflict(
        'BILLING_FEE_PLAN_CONFLICT',
        'Fee plan with same name already exists for school/year',
        {
          schoolId: dto.schoolId,
          academicYearId: dto.academicYearId,
          name: dto.name,
        },
      );
    }

    const row = await this.prisma.feePlan.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        academicYearId: dto.academicYearId,
        name: dto.name,
        currencyCode: dto.currencyCode ?? 'INR',
        isActive: dto.isActive ?? true,
        items: {
          create: dto.items.map((item) => {
            const computed = this.computeFeeItemAmount(item);
            return {
              tenantId: user.tenantId,
              code: item.code,
              name: item.name,
              amount: computed.finalAmount,
              meta: computed.meta,
            };
          }),
        },
      },
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: [{ code: 'asc' }],
        },
      },
    });

    return this.toFeePlanResponse(row);
  }

  async updateFeePlan(user: AuthenticatedUser, feePlanId: string, dto: UpdateFeePlanDto) {
    await this.ensureFeePlan(user, feePlanId);

    const row = await this.prisma.feePlan.update({
      where: { id: feePlanId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.currencyCode !== undefined ? { currencyCode: dto.currencyCode } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: [{ code: 'asc' }],
        },
      },
    });

    return this.toFeePlanResponse(row);
  }

  async listInvoices(user: AuthenticatedUser, query: ListInvoicesQueryDto) {
    const rows = await this.prisma.invoice.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.studentId ? { studentId: query.studentId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      include: {
        lines: {
          where: { deletedAt: null },
          orderBy: [{ id: 'asc' }],
        },
      },
      orderBy: [{ issueDate: 'desc' }, { createdAt: 'desc' }],
    });

    return rows.map((row) => this.toInvoiceResponse(row));
  }

  async createInvoice(user: AuthenticatedUser, dto: CreateInvoiceDto) {
    const duplicate = await this.prisma.invoice.findFirst({
      where: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        invoiceNumber: dto.invoiceNumber,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (duplicate) {
      throw apiConflict(
        'BILLING_INVOICE_NUMBER_CONFLICT',
        'Invoice number already exists for school',
        {
          schoolId: dto.schoolId,
          invoiceNumber: dto.invoiceNumber,
        },
      );
    }

    const subTotal = dto.lines.reduce((acc, line) => {
      const quantity = line.quantity ?? 1;
      return acc.add(this.decimal(line.unitAmount).mul(quantity));
    }, this.decimal(0));
    const taxAmount = this.decimal(dto.taxAmount ?? '0');
    const totalAmount = subTotal.add(taxAmount);

    const row = await this.prisma.invoice.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        studentId: dto.studentId,
        invoiceNumber: dto.invoiceNumber,
        issueDate: new Date(dto.issueDate),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        status: dto.status ?? InvoiceStatus.ISSUED,
        subTotal,
        taxAmount,
        totalAmount,
        balanceAmount: totalAmount,
        currencyCode: dto.currencyCode ?? 'INR',
        lines: {
          create: dto.lines.map((line) => {
            const quantity = line.quantity ?? 1;
            const unitAmount = this.decimal(line.unitAmount);
            return {
              tenantId: user.tenantId,
              feeItemId: line.feeItemId,
              description: line.description,
              quantity,
              unitAmount,
              lineTotal: unitAmount.mul(quantity),
            };
          }),
        },
      },
      include: {
        lines: {
          where: { deletedAt: null },
          orderBy: [{ id: 'asc' }],
        },
      },
    });

    return this.toInvoiceResponse(row);
  }

  async updateInvoice(user: AuthenticatedUser, invoiceId: string, dto: UpdateInvoiceDto) {
    await this.ensureInvoice(user, invoiceId);

    const row = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.dueDate !== undefined ? { dueDate: new Date(dto.dueDate) } : {}),
      },
      include: {
        lines: {
          where: { deletedAt: null },
          orderBy: [{ id: 'asc' }],
        },
      },
    });

    return this.toInvoiceResponse(row);
  }

  async listPayments(user: AuthenticatedUser, query: ListPaymentsQueryDto) {
    const rows = await this.prisma.payment.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.studentId ? { studentId: query.studentId } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.method ? { method: query.method } : {}),
      },
      include: {
        allocations: {
          where: { deletedAt: null },
          orderBy: [{ id: 'asc' }],
        },
      },
      orderBy: [{ paidAt: 'desc' }, { createdAt: 'desc' }],
    });

    return rows.map((row) => this.toPaymentResponse(row));
  }

  async createPayment(user: AuthenticatedUser, dto: CreatePaymentDto) {
    const duplicate = await this.prisma.payment.findFirst({
      where: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        receiptNumber: dto.receiptNumber,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (duplicate) {
      throw apiConflict(
        'BILLING_RECEIPT_NUMBER_CONFLICT',
        'Receipt number already exists for school',
        {
          schoolId: dto.schoolId,
          receiptNumber: dto.receiptNumber,
        },
      );
    }

    const paymentAmount = this.decimal(dto.amount);
    const allocationTotal = (dto.allocations ?? []).reduce(
      (acc, item) => acc.add(this.decimal(item.amount)),
      this.decimal(0),
    );

    if (allocationTotal.gt(paymentAmount)) {
      throw apiConflict(
        'BILLING_PAYMENT_ALLOCATION_EXCEEDS_AMOUNT',
        'Total allocation amount cannot exceed payment amount',
      );
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          studentId: dto.studentId,
          receiptNumber: dto.receiptNumber,
          paidAt: new Date(dto.paidAt),
          amount: paymentAmount,
          currencyCode: dto.currencyCode ?? 'INR',
          method: dto.method,
          status: dto.status ?? PaymentStatus.COMPLETED,
          reference: dto.reference,
        },
      });

      const invoiceIds: string[] = [];
      if (dto.allocations && dto.allocations.length > 0) {
        for (const allocation of dto.allocations) {
          const invoice = await tx.invoice.findFirst({
            where: {
              id: allocation.invoiceId,
              tenantId: user.tenantId,
              studentId: dto.studentId,
              deletedAt: null,
            },
            select: { id: true },
          });
          if (!invoice) {
            throw apiNotFound('BILLING_INVOICE_NOT_FOUND', 'Invoice not found', {
              invoiceId: allocation.invoiceId,
            });
          }

          await tx.paymentAllocation.create({
            data: {
              tenantId: user.tenantId,
              paymentId: payment.id,
              invoiceId: allocation.invoiceId,
              amount: this.decimal(allocation.amount),
            },
          });
          invoiceIds.push(allocation.invoiceId);
        }
      }

      for (const invoiceId of new Set(invoiceIds)) {
        await this.recalculateInvoiceBalance(tx, user.tenantId, invoiceId);
      }

      return tx.payment.findUniqueOrThrow({
        where: { id: payment.id },
        include: {
          allocations: {
            where: { deletedAt: null },
            orderBy: [{ id: 'asc' }],
          },
        },
      });
    });

    return this.toPaymentResponse(created);
  }

  async updatePayment(user: AuthenticatedUser, paymentId: string, dto: UpdatePaymentDto) {
    await this.ensurePayment(user, paymentId);

    const row = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.reference !== undefined ? { reference: dto.reference } : {}),
      },
      include: {
        allocations: {
          where: { deletedAt: null },
          orderBy: [{ id: 'asc' }],
        },
      },
    });

    return this.toPaymentResponse(row);
  }

  private async recalculateInvoiceBalance(
    tx: Prisma.TransactionClient,
    tenantId: string,
    invoiceId: string,
  ) {
    const invoice = await tx.invoice.findFirst({
      where: { id: invoiceId, tenantId, deletedAt: null },
      select: {
        id: true,
        totalAmount: true,
      },
    });
    if (!invoice) return;

    const allocations = await tx.paymentAllocation.aggregate({
      where: {
        tenantId,
        invoiceId,
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
    });

    const allocated = allocations._sum.amount ?? this.decimal(0);
    const balance = invoice.totalAmount.sub(allocated);

    let status: InvoiceStatus = InvoiceStatus.ISSUED;
    if (balance.lte(0)) {
      status = InvoiceStatus.PAID;
    } else if (allocated.gt(0)) {
      status = InvoiceStatus.PARTIAL;
    }

    await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        balanceAmount: balance.lt(0) ? this.decimal(0) : balance,
        status,
      },
    });
  }

  private async ensureFeePlan(user: AuthenticatedUser, id: string) {
    const exists = await this.prisma.feePlan.findFirst({
      where: { id, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!exists) throw apiNotFound('BILLING_FEE_PLAN_NOT_FOUND', 'Fee plan not found', { feePlanId: id });
  }

  private async ensureInvoice(user: AuthenticatedUser, id: string) {
    const exists = await this.prisma.invoice.findFirst({
      where: { id, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!exists) throw apiNotFound('BILLING_INVOICE_NOT_FOUND', 'Invoice not found', { invoiceId: id });
  }

  private async ensurePayment(user: AuthenticatedUser, id: string) {
    const exists = await this.prisma.payment.findFirst({
      where: { id, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!exists) throw apiNotFound('BILLING_PAYMENT_NOT_FOUND', 'Payment not found', { paymentId: id });
  }

  private decimal(value: string | number | Prisma.Decimal) {
    return value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value);
  }

  private toMoney(value: Prisma.Decimal) {
    return value.toFixed(2);
  }

  private toFeePlanResponse(
    row: FeePlan & {
      items: Array<{
        id: string;
        code: string;
        name: string;
        amount: Prisma.Decimal;
        meta: Prisma.JsonValue | null;
      }>;
    },
  ): FeePlanResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      academicYearId: row.academicYearId,
      name: row.name,
      currencyCode: row.currencyCode,
      isActive: row.isActive,
      items: row.items.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        amount: this.toMoney(item.amount),
        meta: (item.meta as unknown as FeePlanResponseDto['items'][number]['meta']) ?? undefined,
      })),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private computeFeeItemAmount(item: {
    amount?: string;
    attributes?: Array<{ key: string; label: string; amount: string }>;
    discount?: { type: FeeDiscountType; value: string; reason?: string };
  }): { finalAmount: Prisma.Decimal; meta: Prisma.InputJsonValue } {
    const attributes = item.attributes ?? [];
    const hasAttributes = attributes.length > 0;
    const baseAmount = hasAttributes
      ? attributes.reduce((acc, attribute) => acc.add(this.decimal(attribute.amount)), this.decimal(0))
      : this.decimal(item.amount ?? '0');

    if (baseAmount.lte(0)) {
      throw apiUnprocessable(
        'BILLING_INVALID_FEE_ITEM_AMOUNT',
        'Fee item amount must be greater than zero',
      );
    }

    let discountAmount = this.decimal(0);
    if (item.discount) {
      const discountValue = this.decimal(item.discount.value);
      if (item.discount.type === FeeDiscountType.PERCENTAGE) {
        if (discountValue.lt(0) || discountValue.gt(100)) {
          throw apiUnprocessable(
            'BILLING_INVALID_DISCOUNT_PERCENTAGE',
            'Percentage discount must be between 0 and 100',
          );
        }
        discountAmount = baseAmount.mul(discountValue).div(100);
      } else {
        discountAmount = discountValue;
      }
    }

    const finalAmount = baseAmount.sub(discountAmount);
    if (finalAmount.lt(0)) {
      throw apiUnprocessable(
        'BILLING_INVALID_DISCOUNT',
        'Discount cannot make final amount negative',
      );
    }

    const meta: Prisma.InputJsonValue = {
      pricingModel: hasAttributes ? 'ATTRIBUTE_SUM' : 'FLAT',
      baseAmount: this.toMoney(baseAmount),
      attributes: hasAttributes
        ? attributes.map((attribute) => ({
            key: attribute.key,
            label: attribute.label,
            amount: this.toMoney(this.decimal(attribute.amount)),
          }))
        : undefined,
      discount: item.discount
        ? {
            type: item.discount.type,
            value: item.discount.value,
            reason: item.discount.reason,
            appliedAmount: this.toMoney(discountAmount),
          }
        : undefined,
      finalAmount: this.toMoney(finalAmount),
    };

    return { finalAmount, meta };
  }

  private toInvoiceResponse(
    row: Invoice & {
      lines: Array<{
        id: string;
        feeItemId: string | null;
        description: string;
        quantity: number;
        unitAmount: Prisma.Decimal;
        lineTotal: Prisma.Decimal;
      }>;
    },
  ): InvoiceResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      studentId: row.studentId,
      invoiceNumber: row.invoiceNumber,
      issueDate: row.issueDate.toISOString(),
      dueDate: row.dueDate ? row.dueDate.toISOString() : null,
      status: row.status,
      subTotal: this.toMoney(row.subTotal),
      taxAmount: this.toMoney(row.taxAmount),
      totalAmount: this.toMoney(row.totalAmount),
      balanceAmount: this.toMoney(row.balanceAmount),
      currencyCode: row.currencyCode,
      lines: row.lines.map((line) => ({
        id: line.id,
        feeItemId: line.feeItemId,
        description: line.description,
        quantity: line.quantity,
        unitAmount: this.toMoney(line.unitAmount),
        lineTotal: this.toMoney(line.lineTotal),
      })),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private toPaymentResponse(
    row: Payment & {
      allocations: Array<{ id: string; invoiceId: string; amount: Prisma.Decimal }>;
    },
  ): PaymentResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      studentId: row.studentId,
      receiptNumber: row.receiptNumber,
      paidAt: row.paidAt.toISOString(),
      amount: this.toMoney(row.amount),
      method: row.method,
      status: row.status,
      reference: row.reference,
      currencyCode: row.currencyCode,
      allocations: row.allocations.map((allocation) => ({
        id: allocation.id,
        invoiceId: allocation.invoiceId,
        amount: this.toMoney(allocation.amount),
      })),
      createdAt: row.createdAt.toISOString(),
    };
  }
}
