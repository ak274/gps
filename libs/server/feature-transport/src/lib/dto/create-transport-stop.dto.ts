import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';

export class CreateTransportStopDto {
  @ApiProperty()
  @IsString()
  routeId!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sequenceNo!: number;
}
