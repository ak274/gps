import { InvoiceDeliveryChannel } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDeliveryDto {
  @ApiProperty({ enum: InvoiceDeliveryChannel }) @IsEnum(InvoiceDeliveryChannel) channel!: InvoiceDeliveryChannel;
  @ApiPropertyOptional() @IsOptional() @IsString() recipient?: string;
}
