import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length } from 'class-validator';

export class FeeItemInputDto {
  @ApiProperty({ example: 'TUITION' })
  @IsString()
  @Length(2, 30)
  code!: string;

  @ApiProperty({ example: 'Tuition Fee' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ example: '25000.00' })
  @IsNumberString()
  amount!: string;
}
