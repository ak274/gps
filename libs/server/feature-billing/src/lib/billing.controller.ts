import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { BillingService } from './billing.service';
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

@ApiTags('billing')
@ApiBearerAuth()
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @ApiOperation({ summary: 'List fee plans in authenticated tenant' })
  @ApiOkResponse({ type: [FeePlanResponseDto] })
  @Scopes('billing.feePlans.read')
  @Get('fee-plans')
  listFeePlans(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListFeePlansQueryDto,
  ) {
    return this.billingService.listFeePlans(user, query);
  }

  @ApiOperation({ summary: 'Create fee plan with fee items' })
  @ApiOkResponse({ type: FeePlanResponseDto })
  @ApiConflictResponse({ description: 'Duplicate fee plan name for school/year' })
  @Scopes('billing.feePlans.write')
  @Post('fee-plans')
  createFeePlan(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFeePlanDto,
  ) {
    return this.billingService.createFeePlan(user, dto);
  }

  @ApiOperation({ summary: 'Update fee plan metadata' })
  @ApiOkResponse({ type: FeePlanResponseDto })
  @ApiNotFoundResponse({ description: 'Fee plan not found' })
  @Scopes('billing.feePlans.write')
  @Patch('fee-plans/:feePlanId')
  updateFeePlan(
    @CurrentUser() user: AuthenticatedUser,
    @Param('feePlanId') feePlanId: string,
    @Body() dto: UpdateFeePlanDto,
  ) {
    return this.billingService.updateFeePlan(user, feePlanId, dto);
  }

  @ApiOperation({ summary: 'List invoices in authenticated tenant' })
  @ApiOkResponse({ type: [InvoiceResponseDto] })
  @Scopes('billing.invoices.read')
  @Get('invoices')
  listInvoices(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListInvoicesQueryDto,
  ) {
    return this.billingService.listInvoices(user, query);
  }

  @ApiOperation({ summary: 'Create invoice with invoice lines' })
  @ApiOkResponse({ type: InvoiceResponseDto })
  @ApiConflictResponse({ description: 'Duplicate invoice number in school' })
  @Scopes('billing.invoices.write')
  @Post('invoices')
  createInvoice(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.billingService.createInvoice(user, dto);
  }

  @ApiOperation({ summary: 'Update invoice status/due date' })
  @ApiOkResponse({ type: InvoiceResponseDto })
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  @Scopes('billing.invoices.write')
  @Patch('invoices/:invoiceId')
  updateInvoice(
    @CurrentUser() user: AuthenticatedUser,
    @Param('invoiceId') invoiceId: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.billingService.updateInvoice(user, invoiceId, dto);
  }

  @ApiOperation({ summary: 'List payments in authenticated tenant' })
  @ApiOkResponse({ type: [PaymentResponseDto] })
  @Scopes('billing.payments.read')
  @Get('payments')
  listPayments(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListPaymentsQueryDto,
  ) {
    return this.billingService.listPayments(user, query);
  }

  @ApiOperation({ summary: 'Create payment with optional invoice allocations' })
  @ApiOkResponse({ type: PaymentResponseDto })
  @ApiConflictResponse({ description: 'Duplicate receipt number or invalid allocation' })
  @Scopes('billing.payments.write')
  @Post('payments')
  createPayment(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.billingService.createPayment(user, dto);
  }

  @ApiOperation({ summary: 'Update payment status/reference' })
  @ApiOkResponse({ type: PaymentResponseDto })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  @Scopes('billing.payments.write')
  @Patch('payments/:paymentId')
  updatePayment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('paymentId') paymentId: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.billingService.updatePayment(user, paymentId, dto);
  }
}
