import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional({
    description: 'Optional refresh token to revoke this specific session when sid is unavailable',
  })
  @IsOptional()
  @IsString()
  @MinLength(16)
  refreshToken?: string;
}
