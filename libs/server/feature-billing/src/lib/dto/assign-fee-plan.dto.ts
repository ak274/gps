import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignFeePlanDto {
  @ApiProperty()
  @IsString()
  feePlanId!: string;

  @ApiProperty()
  @IsString()
  targetId!: string;
}
