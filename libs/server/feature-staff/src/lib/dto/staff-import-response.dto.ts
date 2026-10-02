import { ApiProperty } from '@nestjs/swagger';

export class StaffImportErrorDto {
  @ApiProperty()
  rowIndex!: number;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  details!: Record<string, unknown>;
}

export class StaffImportRecordDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string | null;

  @ApiProperty()
  employeeCode!: string;

  @ApiProperty()
  designation!: string | null;

  @ApiProperty()
  employmentType!: string | null;

  @ApiProperty()
  joinedOn!: string | null;
}

export class StaffImportPreviewResponseDto {
  @ApiProperty()
  totalRows!: number;

  @ApiProperty()
  validRows!: number;

  @ApiProperty()
  invalidRows!: number;

  @ApiProperty({ type: [StaffImportRecordDto] })
  records!: StaffImportRecordDto[];

  @ApiProperty({ type: [StaffImportErrorDto] })
  errors!: StaffImportErrorDto[];
}

export class StaffImportCommitResponseDto {
  @ApiProperty()
  createdCount!: number;

  @ApiProperty()
  invitedCount!: number;

  @ApiProperty({ type: [StaffImportErrorDto] })
  errors!: StaffImportErrorDto[];
}

export class StaffImportCommitDto {
  @ApiProperty({ type: [StaffImportRecordDto] })
  records!: StaffImportRecordDto[];
}
