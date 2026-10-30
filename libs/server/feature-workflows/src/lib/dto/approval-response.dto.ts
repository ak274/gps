import { ApprovalStatus, ApprovalStepStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApprovalStepResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() sequence!: number;
  @ApiProperty() assigneeId!: string;
  @ApiPropertyOptional() assigneeName!: string | null;
  @ApiProperty({ enum: ApprovalStepStatus }) status!: ApprovalStepStatus;
  @ApiPropertyOptional() decisionNote!: string | null;
  @ApiPropertyOptional() decidedAt!: string | null;
}

export class ApprovalResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() schoolId!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description!: string | null;
  @ApiProperty({ enum: ApprovalStatus }) status!: ApprovalStatus;
  @ApiProperty() entityType!: string;
  @ApiProperty() entityId!: string;
  @ApiProperty() requestedById!: string;
  @ApiPropertyOptional() dueAt!: string | null;
  @ApiProperty({ type: [ApprovalStepResponseDto] }) steps!: ApprovalStepResponseDto[];
  @ApiProperty() createdAt!: string;
}
