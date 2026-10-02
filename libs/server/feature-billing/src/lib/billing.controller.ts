import { Body, Controller, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
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
import { AssignFeePlanDto } from './dto/assign-fee-plan.dto';
import { CreateFeeAdjustmentDto } from './dto/create-fee-adjustment.dto';
import { CreateInvoiceScheduleDto } from './dto/create-invoice-schedule.dto';
import { GenerateInvoicesDto } from './dto/generate-invoices.dto';
import { CreateInvoiceDeliveryDto } from './dto/create-invoice-delivery.dto';
import { RunRemindersDto } from './dto/run-reminders.dto';
import { StudentLedgerResponseDto } from './dto/student-ledger-response.dto';
import { RunSchedulesDto } from './dto/run-schedules.dto';

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

  @ApiOperation({ summary: 'List class and student fee-plan assignments' })
  @ApiOkResponse({ type: Object, isArray: true })
  @Scopes('billing.feePlans.read')
  @Get('assignments')
  listFeeAssignments(@CurrentUser() user: AuthenticatedUser, @Query('schoolId') schoolId?: string) {
    return this.billingService.listFeeAssignments(user, schoolId);
  }

  @ApiOperation({ summary: 'Assign a fee plan to an entire class' })
  @ApiOkResponse({ type: Object })
  @Scopes('billing.feePlans.write')
  @Post('assignments/classes')
  assignFeePlanToClass(@CurrentUser() user: AuthenticatedUser, @Body() dto: AssignFeePlanDto) {
    return this.billingService.assignFeePlanToClass(user, dto);
  }

  @ApiOperation({ summary: 'Assign a fee plan to one student' })
  @ApiOkResponse({ type: Object })
  @Scopes('billing.feePlans.write')
  @Post('assignments/students')
  assignFeePlanToStudent(@CurrentUser() user: AuthenticatedUser, @Body() dto: AssignFeePlanDto) {
    return this.billingService.assignFeePlanToStudent(user, dto);
  }

  @ApiOperation({ summary: 'Add a charge or discount to a class or student' })
  @ApiOkResponse({ type: Object })
  @Scopes('billing.feePlans.write')
  @Post('adjustments')
  createFeeAdjustment(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateFeeAdjustmentDto) {
    return this.billingService.createFeeAdjustment(user, dto);
  }

  @ApiOperation({ summary: 'List recurring invoice schedules' })
  @ApiOkResponse({ type: Object, isArray: true })
  @Scopes('billing.invoices.read')
  @Get('schedules')
  listInvoiceSchedules(@CurrentUser() user: AuthenticatedUser, @Query('schoolId') schoolId?: string) {
    return this.billingService.listInvoiceSchedules(user, schoolId);
  }

  @ApiOperation({ summary: 'Create a recurring invoice schedule' })
  @ApiOkResponse({ type: Object })
  @Scopes('billing.invoices.write')
  @Post('schedules')
  createInvoiceSchedule(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateInvoiceScheduleDto) {
    return this.billingService.createInvoiceSchedule(user, dto);
  }

  @ApiOperation({ summary: 'Generate all due recurring schedules for a school' })
  @ApiOkResponse({ type: Object })
  @Scopes('billing.invoices.write')
  @Post('schedules/run')
  runInvoiceSchedules(@CurrentUser() user: AuthenticatedUser, @Body() dto: RunSchedulesDto) {
    return this.billingService.runInvoiceSchedules(user, dto);
  }

  @ApiOperation({ summary: 'Generate an idempotent invoice batch for a billing period' })
  @ApiOkResponse({ type: Object })
  @Scopes('billing.invoices.write')
  @Post('invoices/generate')
  generateInvoices(@CurrentUser() user: AuthenticatedUser, @Body() dto: GenerateInvoicesDto) {
    return this.billingService.generateInvoices(user, dto);
  }

  @ApiOperation({ summary: 'Queue an invoice for email or publish it in the portal' })
  @ApiOkResponse({ type: Object })
  @Scopes('billing.invoices.write')
  @Post('invoices/:invoiceId/deliver')
  deliverInvoice(@CurrentUser() user: AuthenticatedUser, @Param('invoiceId') invoiceId: string, @Body() dto: CreateInvoiceDeliveryDto) {
    return this.billingService.deliverInvoice(user, invoiceId, dto);
  }

  @ApiOperation({ summary: 'Queue payment reminders for due and overdue invoices' })
  @ApiOkResponse({ type: Object })
  @Scopes('billing.invoices.write')
  @Post('reminders/run')
  runPaymentReminders(@CurrentUser() user: AuthenticatedUser, @Body() dto: RunRemindersDto) {
    return this.billingService.runPaymentReminders(user, dto);
  }

  @ApiOperation({ summary: 'Return a chronological student account ledger' })
  @ApiOkResponse({ type: StudentLedgerResponseDto })
  @Scopes('billing.invoices.read')
  @Get('students/:studentId/ledger')
  getStudentLedger(@CurrentUser() user: AuthenticatedUser, @Param('studentId') studentId: string) {
    return this.billingService.getStudentLedger(user, studentId);
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

  @ApiOperation({ summary: 'Render a print-ready payment receipt' })
  @Scopes('billing.payments.read')
  @Get('payments/:paymentId/receipt')
  async renderPaymentReceipt(@CurrentUser() user: AuthenticatedUser, @Param('paymentId') paymentId: string, @Res() response: Response) {
    response.type('html').send(await this.billingService.renderPaymentReceipt(user, paymentId));
  }
}
