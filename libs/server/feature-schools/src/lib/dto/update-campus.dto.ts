import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCampusDto {
  @ApiPropertyOptional({ example: 'Main Campus - North Wing' })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;

  @ApiPropertyOptional({ example: 'Sector 62' })
  @IsOptional()
  @IsString()
  @Length(2, 160)
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Near City Mall' })
  @IsOptional()
  @IsString()
  @Length(2, 160)
  addressLine2?: string;

  @ApiPropertyOptional({ example: 'Noida' })
  @IsOptional()
  @IsString()
  @Length(2, 80)
  city?: string;

  @ApiPropertyOptional({ example: 'Uttar Pradesh' })
  @IsOptional()
  @IsString()
  @Length(2, 80)
  state?: string;

  @ApiPropertyOptional({ example: '201301' })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  postalCode?: string;
}
