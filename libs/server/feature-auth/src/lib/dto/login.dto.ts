import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@gps.local' })
  @Transform(({ value }) => String(value).trim().toLowerCase())
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'ChangeMe123!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: 'demo-school' })
  @Transform(({ value }) => (value == null ? undefined : String(value).trim()))
  @IsOptional()
  @IsString()
  tenantCode?: string;
}
