import { ApiProperty } from '@nestjs/swagger';

export class StudentLedgerEntryDto {
  @ApiProperty() id!: string;
  @ApiProperty({ enum: ['INVOICE', 'PAYMENT'] }) type!: 'INVOICE' | 'PAYMENT';
  @ApiProperty() date!: string;
  @ApiProperty() description!: string;
  @ApiProperty() debit!: string;
  @ApiProperty() credit!: string;
  @ApiProperty() balance!: string;
  @ApiProperty() reference!: string;
}

export class StudentLedgerResponseDto {
  @ApiProperty() studentId!: string;
  @ApiProperty() currencyCode!: string;
  @ApiProperty() openingBalance!: string;
  @ApiProperty() closingBalance!: string;
  @ApiProperty({ type: [StudentLedgerEntryDto] }) entries!: StudentLedgerEntryDto[];
}
