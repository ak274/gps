import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class ListMessagesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ description: 'Filter conversation with this user id' })
  @IsOptional()
  @IsString()
  withUserId?: string;

  @ApiPropertyOptional({ enum: ['all', 'inbox', 'sent'], default: 'all' })
  @IsOptional()
  @IsIn(['all', 'inbox', 'sent'])
  direction?: 'all' | 'inbox' | 'sent';
}
