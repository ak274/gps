import { InvoiceStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumberString, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { InvoiceLineInputDto } from './invoice-line-input.dto';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty()
  @IsString()
  studentId!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 60)
  invoiceNumber!: string;

  @ApiProperty({ format: 'date' })
  @IsDateString()
  issueDate!: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: InvoiceStatus, default: InvoiceStatus.ISSUED })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiPropertyOptional({ example: '0.00', default: '0.00' })
  @IsOptional()
  @IsNumberString()
  taxAmount?: string;

  @ApiPropertyOptional({ default: 'INR' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currencyCode?: string;

  @ApiProperty({ type: [InvoiceLineInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineInputDto)
  lines!: InvoiceLineInputDto[];
}
