import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'teacher@gps.local' })
  @Transform(({ value }) => String(value).trim().toLowerCase())
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'ChangeMe123!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'SchoolName-tenant' })
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @MinLength(1)
  tenantCode!: string;

  @ApiProperty({ example: 'John' })
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @MinLength(1)
  firstName!: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @Transform(({ value }) => (value == null ? undefined : String(value).trim()))
  @IsOptional()
  @IsString()
  lastName?: string;
}

