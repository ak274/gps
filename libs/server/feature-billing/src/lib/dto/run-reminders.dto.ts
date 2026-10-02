import { InvoiceDeliveryChannel } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class RunRemindersDto {
  @ApiProperty() @IsString() schoolId!: string;
  @ApiProperty({ format: 'date-time' }) @IsOptional() @IsDateString() asOf?: string;
  @ApiPropertyOptional({ enum: InvoiceDeliveryChannel, default: InvoiceDeliveryChannel.EMAIL }) @IsOptional() @IsEnum(InvoiceDeliveryChannel) channel?: InvoiceDeliveryChannel;
  @ApiPropertyOptional({ default: 3 }) @IsOptional() @IsInt() @Min(0) @Max(30) daysBeforeDue?: number;
}
