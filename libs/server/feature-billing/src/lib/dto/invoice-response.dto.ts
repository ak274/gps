import { InvoiceStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceLineResponseDto } from './invoice-line-response.dto';

export class InvoiceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  invoiceNumber!: string;

  @ApiProperty({ description: 'ISO date string' })
  issueDate!: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  dueDate!: string | null;

  @ApiProperty({ enum: InvoiceStatus })
  status!: InvoiceStatus;

  @ApiProperty({ example: '2000.00' })
  subTotal!: string;

  @ApiProperty({ example: '180.00' })
  taxAmount!: string;

  @ApiProperty({ example: '2180.00' })
  totalAmount!: string;

  @ApiProperty({ example: '2180.00' })
  balanceAmount!: string;

  @ApiProperty()
  currencyCode!: string;

  @ApiProperty({ type: [InvoiceLineResponseDto] })
  lines!: InvoiceLineResponseDto[];

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}
