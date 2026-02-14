import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { UpsertAttendanceRecordDto } from './upsert-attendance-record.dto';

export class BulkUpsertAttendanceRecordsDto {
  @ApiProperty({ type: [UpsertAttendanceRecordDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpsertAttendanceRecordDto)
  records!: UpsertAttendanceRecordDto[];
}
