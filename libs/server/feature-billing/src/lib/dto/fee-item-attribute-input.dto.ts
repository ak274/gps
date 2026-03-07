import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length } from 'class-validator';

export class FeeItemAttributeInputDto {
  @ApiProperty({ example: 'BUS_STOP_DISTANCE' })
  @IsString()
  @Length(2, 50)
  key!: string;

  @ApiProperty({ example: 'Bus stop distance slab' })
  @IsString()
  @Length(2, 120)
  label!: string;

  @ApiProperty({ example: '500.00' })
  @IsNumberString()
  amount!: string;
}
