import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Length } from 'class-validator';

export class DecideApprovalDto {
  @ApiProperty({ enum: ['APPROVE', 'REJECT', 'REQUEST_CHANGES'] })
  @IsIn(['APPROVE', 'REJECT', 'REQUEST_CHANGES'])
  decision!: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES';

  @ApiProperty({ minLength: 2, maxLength: 2000 })
  @IsString()
  @Length(2, 2000)
  note!: string;
}
