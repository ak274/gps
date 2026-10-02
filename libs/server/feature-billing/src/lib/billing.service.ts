import { PrismaService } from '@gps/data-access-db';
import {
  FeePlan,
  Invoice,
  InvoiceStatus,
  EnrollmentStatus,
  Payment,
  PaymentStatus,
  Prisma,
  FeeBillingCycle,
  InvoiceDeliveryChannel,
  InvoiceDeliveryStatus,
  ReminderStatus,
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
import { AssignFeePlanDto } from './dto/assign-fee-plan.dto';
import { CreateFeeAdjustmentDto } from './dto/create-fee-adjustment.dto';
import { CreateInvoiceScheduleDto } from './dto/create-invoice-schedule.dto';
import { GenerateInvoicesDto } from './dto/generate-invoices.dto';
import { CreateInvoiceDeliveryDto } from './dto/create-invoice-delivery.dto';
import { RunRemindersDto } from './dto/run-reminders.dto';
import { StudentLedgerResponseDto } from './dto/student-ledger-response.dto';
import { RunSchedulesDto } from './dto/run-schedules.dto';

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
        billingCycle: dto.billingCycle ?? FeeBillingCycle.ANNUAL,
        dueDay: dto.dueDay,
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

  async listFeeAssignments(user: AuthenticatedUser, schoolId?: string) {
    const [classes, students] = await Promise.all([
      this.prisma.classroomFeePlan.findMany({
        where: { tenantId: user.tenantId, deletedAt: null, ...(schoolId ? { classRoom: { schoolId } } : {}) },
        include: { feePlan: { select: { id: true, name: true } }, classRoom: { select: { name: true, section: true } } },
      }),
      this.prisma.studentFeePlan.findMany({
        where: { tenantId: user.tenantId, deletedAt: null, ...(schoolId ? { student: { schoolId } } : {}) },
        include: { feePlan: { select: { id: true, name: true } }, student: { select: { firstName: true, lastName: true, admissionNo: true } } },
      }),
    ]);
    return [
      ...classes.map((row) => ({ id: row.id, feePlanId: row.feePlanId, feePlanName: row.feePlan.name, scope: 'CLASS' as const, targetId: row.classRoomId, targetLabel: `${row.classRoom.name} · ${row.classRoom.section ?? 'Main'}` })),
      ...students.map((row) => ({ id: row.id, feePlanId: row.feePlanId, feePlanName: row.feePlan.name, scope: 'STUDENT' as const, targetId: row.studentId, targetLabel: `${row.student.firstName} ${row.student.lastName ?? ''} · ${row.student.admissionNo}` })),
    ];
  }

  async listInvoiceSchedules(user: AuthenticatedUser, schoolId?: string) {
    const rows = await this.prisma.invoiceSchedule.findMany({
      where: { tenantId: user.tenantId, ...(schoolId ? { schoolId } : {}), isActive: true },
      include: { feePlan: { select: { id: true, name: true, billingCycle: true } }, _count: { select: { invoices: true } } },
      orderBy: [{ createdAt: 'desc' }],
    });
    return rows.map((row) => ({
      id: row.id,
      schoolId: row.schoolId,
      academicYearId: row.academicYearId,
      feePlanId: row.feePlanId,
      feePlanName: row.feePlan.name,
      name: row.name,
      billingCycle: row.billingCycle,
      startsOn: row.startsOn.toISOString(),
      endsOn: row.endsOn?.toISOString() ?? null,
      issueDay: row.issueDay,
      dueDay: row.dueDay,
      autoPublish: row.autoPublish,
      autoEmail: row.autoEmail,
      invoiceCount: row._count.invoices,
      lastGeneratedAt: row.lastGeneratedAt?.toISOString() ?? null,
    }));
  }

  async createInvoiceSchedule(user: AuthenticatedUser, dto: CreateInvoiceScheduleDto) {
    const [school, academicYear, feePlan] = await Promise.all([
      this.prisma.school.findFirst({ where: { id: dto.schoolId, tenantId: user.tenantId, deletedAt: null }, select: { id: true } }),
      this.prisma.academicYear.findFirst({ where: { id: dto.academicYearId, tenantId: user.tenantId, schoolId: dto.schoolId, deletedAt: null }, select: { id: true } }),
      this.prisma.feePlan.findFirst({ where: { id: dto.feePlanId, tenantId: user.tenantId, schoolId: dto.schoolId, deletedAt: null }, select: { id: true } }),
    ]);
    if (!school || !academicYear || !feePlan) throw apiNotFound('BILLING_SCHEDULE_TARGET_NOT_FOUND', 'School, academic year, or fee plan not found');
    try {
      return await this.prisma.invoiceSchedule.create({
        data: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          academicYearId: dto.academicYearId,
          feePlanId: dto.feePlanId,
          name: dto.name,
          billingCycle: dto.billingCycle,
          startsOn: new Date(dto.startsOn),
          endsOn: dto.endsOn ? new Date(dto.endsOn) : null,
          issueDay: dto.issueDay ?? 1,
          dueDay: dto.dueDay ?? 10,
          autoPublish: dto.autoPublish ?? true,
          autoEmail: dto.autoEmail ?? false,
          createdById: user.sub,
          updatedById: user.sub,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw apiConflict('BILLING_SCHEDULE_CONFLICT', 'An invoice schedule already exists for this fee plan and academic year');
      }
      throw error;
    }
  }

  async runInvoiceSchedules(user: AuthenticatedUser, dto: RunSchedulesDto) {
    const asOf = dto.asOf ? new Date(dto.asOf) : new Date();
    const schedules = await this.prisma.invoiceSchedule.findMany({ where: { tenantId: user.tenantId, schoolId: dto.schoolId, isActive: true, startsOn: { lte: asOf }, OR: [{ endsOn: null }, { endsOn: { gte: asOf } }] }, orderBy: [{ createdAt: 'asc' }] });
    const batches = [];
    for (const schedule of schedules) {
      const period = this.periodForSchedule(schedule.billingCycle, asOf, schedule.startsOn);
      batches.push(await this.generateInvoices(user, { scheduleId: schedule.id, periodStart: period.start.toISOString(), periodEnd: period.end.toISOString(), issueDate: asOf.toISOString(), dueDate: this.addDays(asOf, Math.max(1, schedule.dueDay - schedule.issueDay)).toISOString() }));
    }
    return { schoolId: dto.schoolId, asOf: asOf.toISOString(), schedulesRun: batches.length, batches };
  }

  async generateInvoices(user: AuthenticatedUser, dto: GenerateInvoicesDto) {
    const schedule = await this.prisma.invoiceSchedule.findFirst({
      where: { id: dto.scheduleId, tenantId: user.tenantId, isActive: true },
      include: { feePlan: { include: { items: { where: { deletedAt: null }, orderBy: [{ code: 'asc' }] } } } },
    });
    if (!schedule) throw apiNotFound('BILLING_SCHEDULE_NOT_FOUND', 'Invoice schedule not found');

    const periodStart = new Date(dto.periodStart);
    const periodEnd = new Date(dto.periodEnd);
    if (periodEnd < periodStart) throw apiUnprocessable('BILLING_INVALID_PERIOD', 'Invoice period end must be on or after period start');
    const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date();
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : this.addDays(issueDate, Math.max(1, schedule.dueDay - schedule.issueDay));
    const students = await this.prisma.student.findMany({
      where: {
        tenantId: user.tenantId,
        schoolId: schedule.schoolId,
        currentStatus: EnrollmentStatus.ACTIVE,
        deletedAt: null,
        OR: [
          { feePlans: { some: { feePlanId: schedule.feePlanId, deletedAt: null } } },
          { enrollments: { some: { academicYearId: schedule.academicYearId, status: EnrollmentStatus.ACTIVE, deletedAt: null, classRoom: { feePlans: { some: { feePlanId: schedule.feePlanId, deletedAt: null } } } } } },
        ],
      },
      select: { id: true, admissionNo: true, enrollments: { where: { academicYearId: schedule.academicYearId, status: EnrollmentStatus.ACTIVE, deletedAt: null }, orderBy: [{ enrolledOn: 'desc' }], take: 1, select: { classRoomId: true } } },
    });

    const generated: Array<ReturnType<typeof this.toInvoiceResponse>> = [];
    await this.prisma.$transaction(async (tx) => {
      for (const student of students) {
        const existing = await tx.invoice.findFirst({ where: { tenantId: user.tenantId, scheduleId: schedule.id, studentId: student.id, periodStart, periodEnd, deletedAt: null }, include: { lines: { where: { deletedAt: null }, orderBy: [{ id: 'asc' }] } } });
        if (existing) { generated.push(this.toInvoiceResponse(existing)); continue; }

        const lines: Array<{ feeItemId?: string; description: string; quantity: number; unitAmount: Prisma.Decimal; lineTotal: Prisma.Decimal }> = schedule.feePlan.items.map((item) => ({ feeItemId: item.id, description: item.name, quantity: 1, unitAmount: item.amount, lineTotal: item.amount }));
        const baseAmount = lines.reduce((sum, line) => sum.add(line.lineTotal), this.decimal(0));
        const adjustmentRows = await tx.feeAdjustment.findMany({ where: { tenantId: user.tenantId, schoolId: schedule.schoolId, deletedAt: null, OR: [{ studentId: student.id }, ...(student.enrollments[0]?.classRoomId ? [{ classRoomId: student.enrollments[0].classRoomId }] : [])], AND: [{ OR: [{ feePlanId: null }, { feePlanId: schedule.feePlanId }] }, { OR: [{ billingCycle: schedule.billingCycle }, { billingCycle: FeeBillingCycle.ONE_TIME }] }] } });
        for (const adjustment of adjustmentRows) {
          const amount = adjustment.type === 'DISCOUNT' ? this.decimal(adjustment.amount).neg() : this.decimal(adjustment.amount);
          lines.push({ description: adjustment.name, quantity: 1, unitAmount: amount, lineTotal: amount });
        }
        const familyLinks = await tx.familyStudent.findMany({ where: { studentId: student.id }, include: { family: { include: { students: true, benefits: { where: { schoolId: schedule.schoolId, isActive: true, OR: [{ feePlanId: null }, { feePlanId: schedule.feePlanId }] } } } } } });
        const benefit = familyLinks.flatMap((link) => link.family.benefits.map((item) => ({ item, count: link.family.students.length }))).find(({ item, count }) => count >= item.minimumStudentCount);
        if (benefit) {
          const discount = benefit.item.type === 'WAIVER' ? baseAmount : benefit.item.type === 'PERCENTAGE' ? baseAmount.mul(benefit.item.value).div(100) : this.decimal(benefit.item.value);
          const bounded = discount.gt(baseAmount) ? baseAmount : discount;
          lines.push({ description: benefit.item.reason, quantity: 1, unitAmount: bounded.neg(), lineTotal: bounded.neg() });
        }
        const subTotal = lines.reduce((sum, line) => sum.add(line.lineTotal), this.decimal(0));
        const totalAmount = subTotal.lt(0) ? this.decimal(0) : subTotal;
        const row = await tx.invoice.create({ data: { tenantId: user.tenantId, schoolId: schedule.schoolId, studentId: student.id, scheduleId: schedule.id, periodStart, periodEnd, invoiceNumber: `INV-${schedule.id.slice(-6)}-${periodStart.toISOString().slice(0, 7).replace('-', '')}-${student.admissionNo}`.slice(0, 60), issueDate, dueDate, status: schedule.autoPublish ? InvoiceStatus.ISSUED : InvoiceStatus.DRAFT, subTotal: totalAmount, taxAmount: this.decimal(0), totalAmount, balanceAmount: totalAmount, currencyCode: schedule.feePlan.currencyCode, createdById: user.sub, updatedById: user.sub, lines: { create: lines.map((line) => ({ tenantId: user.tenantId, feeItemId: line.feeItemId, description: line.description, quantity: line.quantity, unitAmount: line.unitAmount, lineTotal: line.lineTotal, createdById: user.sub, updatedById: user.sub })) } }, include: { lines: { where: { deletedAt: null }, orderBy: [{ id: 'asc' }] } } });
        if (schedule.autoPublish) await tx.invoiceDelivery.create({ data: { tenantId: user.tenantId, schoolId: schedule.schoolId, invoiceId: row.id, channel: InvoiceDeliveryChannel.PORTAL, status: InvoiceDeliveryStatus.SENT, sentAt: new Date(), createdById: user.sub, updatedById: user.sub } });
        if (schedule.autoEmail) await tx.invoiceDelivery.create({ data: { tenantId: user.tenantId, schoolId: schedule.schoolId, invoiceId: row.id, channel: InvoiceDeliveryChannel.EMAIL, status: InvoiceDeliveryStatus.QUEUED, createdById: user.sub, updatedById: user.sub } });
        generated.push(this.toInvoiceResponse(row));
      }
      await tx.invoiceSchedule.update({ where: { id: schedule.id }, data: { lastGeneratedAt: new Date(), updatedById: user.sub } });
    });
    return { scheduleId: schedule.id, periodStart: periodStart.toISOString(), periodEnd: periodEnd.toISOString(), generatedCount: generated.length, invoices: generated };
  }

  async deliverInvoice(user: AuthenticatedUser, invoiceId: string, dto: CreateInvoiceDeliveryDto) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id: invoiceId, tenantId: user.tenantId, deletedAt: null }, select: { id: true, schoolId: true } });
    if (!invoice) throw apiNotFound('BILLING_INVOICE_NOT_FOUND', 'Invoice not found');
    return this.prisma.invoiceDelivery.upsert({ where: { invoiceId_channel: { invoiceId, channel: dto.channel } }, create: { tenantId: user.tenantId, schoolId: invoice.schoolId, invoiceId, channel: dto.channel, recipient: dto.recipient, status: dto.channel === InvoiceDeliveryChannel.PORTAL ? InvoiceDeliveryStatus.SENT : InvoiceDeliveryStatus.QUEUED, sentAt: dto.channel === InvoiceDeliveryChannel.PORTAL ? new Date() : null, createdById: user.sub, updatedById: user.sub }, update: { recipient: dto.recipient, status: dto.channel === InvoiceDeliveryChannel.PORTAL ? InvoiceDeliveryStatus.SENT : InvoiceDeliveryStatus.QUEUED, sentAt: dto.channel === InvoiceDeliveryChannel.PORTAL ? new Date() : null, failureReason: null, updatedById: user.sub } });
  }

  async runPaymentReminders(user: AuthenticatedUser, dto: RunRemindersDto) {
    const asOf = dto.asOf ? new Date(dto.asOf) : new Date();
    const daysBeforeDue = dto.daysBeforeDue ?? 3;
    const cutoff = this.addDays(asOf, daysBeforeDue);
    const invoices = await this.prisma.invoice.findMany({ where: { tenantId: user.tenantId, schoolId: dto.schoolId, deletedAt: null, balanceAmount: { gt: 0 }, status: { in: [InvoiceStatus.ISSUED, InvoiceStatus.PARTIAL, InvoiceStatus.OVERDUE] }, dueDate: { not: null, lte: cutoff } }, select: { id: true, schoolId: true, dueDate: true } });
    let created = 0;
    for (const invoice of invoices) {
      if (invoice.dueDate && invoice.dueDate < asOf) await this.prisma.invoice.update({ where: { id: invoice.id }, data: { status: InvoiceStatus.OVERDUE } });
      await this.prisma.paymentReminder.upsert({ where: { invoiceId_channel_scheduledFor: { invoiceId: invoice.id, channel: dto.channel ?? InvoiceDeliveryChannel.EMAIL, scheduledFor: asOf } }, create: { tenantId: user.tenantId, schoolId: invoice.schoolId, invoiceId: invoice.id, channel: dto.channel ?? InvoiceDeliveryChannel.EMAIL, scheduledFor: asOf, status: ReminderStatus.SCHEDULED, createdById: user.sub, updatedById: user.sub }, update: {} });
      created++;
    }
    return { asOf: asOf.toISOString(), matchedInvoices: invoices.length, remindersQueued: created, channel: dto.channel ?? InvoiceDeliveryChannel.EMAIL };
  }

  async getStudentLedger(user: AuthenticatedUser, studentId: string): Promise<StudentLedgerResponseDto> {
    const student = await this.prisma.student.findFirst({ where: { id: studentId, tenantId: user.tenantId, deletedAt: null }, select: { id: true } });
    if (!student) throw apiNotFound('BILLING_STUDENT_NOT_FOUND', 'Student not found');
    const [invoices, payments] = await Promise.all([
      this.prisma.invoice.findMany({ where: { tenantId: user.tenantId, studentId, deletedAt: null }, orderBy: [{ issueDate: 'asc' }] }),
      this.prisma.payment.findMany({ where: { tenantId: user.tenantId, studentId, deletedAt: null, status: PaymentStatus.COMPLETED }, orderBy: [{ paidAt: 'asc' }] }),
    ]);
    const events = [...invoices.map((invoice) => ({ id: invoice.id, type: 'INVOICE' as const, date: invoice.issueDate, description: `Invoice ${invoice.invoiceNumber}`, debit: invoice.totalAmount, credit: this.decimal(0), reference: invoice.invoiceNumber })), ...payments.map((payment) => ({ id: payment.id, type: 'PAYMENT' as const, date: payment.paidAt, description: `Payment · ${payment.method}`, debit: this.decimal(0), credit: payment.amount, reference: payment.receiptNumber }))].sort((a, b) => a.date.getTime() - b.date.getTime());
    let balance = this.decimal(0);
    return { studentId, currencyCode: invoices[0]?.currencyCode ?? payments[0]?.currencyCode ?? 'INR', openingBalance: '0.00', closingBalance: this.toMoney(events.reduce((sum, event) => sum.add(event.debit).sub(event.credit), this.decimal(0))), entries: events.map((event) => { balance = balance.add(event.debit).sub(event.credit); return { id: event.id, type: event.type, date: event.date.toISOString(), description: event.description, debit: this.toMoney(event.debit), credit: this.toMoney(event.credit), balance: this.toMoney(balance), reference: event.reference }; }) };
  }

  async renderPaymentReceipt(user: AuthenticatedUser, paymentId: string) {
    const payment = await this.prisma.payment.findFirst({ where: { id: paymentId, tenantId: user.tenantId, deletedAt: null }, include: { student: { select: { firstName: true, lastName: true, admissionNo: true } }, allocations: { where: { deletedAt: null }, include: { invoice: { select: { invoiceNumber: true } } } } } });
    if (!payment) throw apiNotFound('BILLING_PAYMENT_NOT_FOUND', 'Payment not found');
    const studentName = `${payment.student.firstName} ${payment.student.lastName ?? ''}`.trim();
    return `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${payment.receiptNumber}</title><style>body{font-family:Arial,sans-serif;color:#17233b;max-width:720px;margin:40px auto;padding:24px}h1{margin-bottom:4px}.meta{color:#64748b;margin-bottom:28px}.row{display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding:12px 0}.total{font-size:22px;font-weight:700;border-top:2px solid #17233b;margin-top:12px}@media print{body{margin:0}}</style></head><body><h1>Payment receipt</h1><div class="meta">Receipt ${payment.receiptNumber} · ${payment.paidAt.toISOString().slice(0, 10)}</div><div class="row"><span>Student</span><strong>${this.escapeHtml(studentName)} · ${this.escapeHtml(payment.student.admissionNo)}</strong></div><div class="row"><span>Payment method</span><strong>${payment.method.replace('_', ' ')}</strong></div><div class="row"><span>Reference</span><strong>${this.escapeHtml(payment.reference ?? '—')}</strong></div><div class="row"><span>Allocated invoices</span><strong>${payment.allocations.map((allocation) => allocation.invoice.invoiceNumber).join(', ') || 'Account credit'}</strong></div><div class="row total"><span>Amount received</span><strong>${payment.currencyCode} ${this.toMoney(payment.amount)}</strong></div><script>window.print()</script></body></html>`;
  }

  async assignFeePlanToClass(user: AuthenticatedUser, dto: AssignFeePlanDto) {
    const [classRoom, feePlan] = await Promise.all([
      this.prisma.classRoom.findFirst({ where: { id: dto.targetId, tenantId: user.tenantId, deletedAt: null }, select: { id: true, schoolId: true } }),
      this.prisma.feePlan.findFirst({ where: { id: dto.feePlanId, tenantId: user.tenantId, deletedAt: null }, select: { id: true, schoolId: true } }),
    ]);
    if (!classRoom || !feePlan) throw apiNotFound('BILLING_ASSIGNMENT_TARGET_NOT_FOUND', 'Class or fee plan not found');
    if (classRoom.schoolId !== feePlan.schoolId) throw apiUnprocessable('BILLING_SCHOOL_MISMATCH', 'Class and fee plan must belong to the same school');
    return this.prisma.classroomFeePlan.upsert({ where: { classRoomId_feePlanId: { classRoomId: dto.targetId, feePlanId: dto.feePlanId } }, create: { tenantId: user.tenantId, classRoomId: dto.targetId, feePlanId: dto.feePlanId, createdById: user.sub, updatedById: user.sub }, update: { deletedAt: null, updatedById: user.sub } });
  }

  async assignFeePlanToStudent(user: AuthenticatedUser, dto: AssignFeePlanDto) {
    const [student, feePlan] = await Promise.all([
      this.prisma.student.findFirst({ where: { id: dto.targetId, tenantId: user.tenantId, deletedAt: null }, select: { id: true, schoolId: true } }),
      this.prisma.feePlan.findFirst({ where: { id: dto.feePlanId, tenantId: user.tenantId, deletedAt: null }, select: { id: true, schoolId: true } }),
    ]);
    if (!student || !feePlan) throw apiNotFound('BILLING_ASSIGNMENT_TARGET_NOT_FOUND', 'Student or fee plan not found');
    if (student.schoolId !== feePlan.schoolId) throw apiUnprocessable('BILLING_SCHOOL_MISMATCH', 'Student and fee plan must belong to the same school');
    return this.prisma.studentFeePlan.upsert({ where: { studentId_feePlanId: { studentId: dto.targetId, feePlanId: dto.feePlanId } }, create: { tenantId: user.tenantId, studentId: dto.targetId, feePlanId: dto.feePlanId, createdById: user.sub, updatedById: user.sub }, update: { deletedAt: null, updatedById: user.sub } });
  }

  async createFeeAdjustment(user: AuthenticatedUser, dto: CreateFeeAdjustmentDto) {
    if (!dto.studentId && !dto.classRoomId) throw apiUnprocessable('BILLING_ADJUSTMENT_TARGET_REQUIRED', 'Choose a student or class as the adjustment target');
    if (dto.studentId && dto.classRoomId) throw apiUnprocessable('BILLING_ADJUSTMENT_ONE_TARGET', 'An adjustment can target a student or a class, not both');
    const target = dto.studentId
      ? await this.prisma.student.findFirst({ where: { id: dto.studentId, tenantId: user.tenantId, schoolId: dto.schoolId, deletedAt: null }, select: { id: true } })
      : await this.prisma.classRoom.findFirst({ where: { id: dto.classRoomId, tenantId: user.tenantId, schoolId: dto.schoolId, deletedAt: null }, select: { id: true } });
    if (!target) throw apiNotFound('BILLING_ADJUSTMENT_TARGET_NOT_FOUND', 'Adjustment target not found');
    return this.prisma.feeAdjustment.create({ data: { tenantId: user.tenantId, schoolId: dto.schoolId, studentId: dto.studentId, classRoomId: dto.classRoomId, feePlanId: dto.feePlanId, code: dto.code, name: dto.name, amount: this.decimal(dto.amount), type: dto.type, billingCycle: dto.billingCycle ?? FeeBillingCycle.ONE_TIME, reason: dto.reason, createdById: user.sub, updatedById: user.sub } });
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

  private addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private periodForSchedule(cycle: FeeBillingCycle, asOf: Date, startsOn: Date) {
    const year = asOf.getUTCFullYear();
    const month = asOf.getUTCMonth();
    if (cycle === FeeBillingCycle.MONTHLY) return { start: new Date(Date.UTC(year, month, 1)), end: new Date(Date.UTC(year, month + 1, 0)) };
    if (cycle === FeeBillingCycle.QUARTERLY) { const quarterStart = Math.floor(month / 3) * 3; return { start: new Date(Date.UTC(year, quarterStart, 1)), end: new Date(Date.UTC(year, quarterStart + 3, 0)) }; }
    if (cycle === FeeBillingCycle.ANNUAL) return { start: new Date(Date.UTC(year, startsOn.getUTCMonth(), 1)), end: new Date(Date.UTC(year + 1, startsOn.getUTCMonth(), 0)) };
    return { start: startsOn, end: startsOn };
  }

  private escapeHtml(value: string) {
    return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
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
