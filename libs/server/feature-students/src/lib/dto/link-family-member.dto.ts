import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LinkFamilyMemberDto {
  @ApiProperty()
  @IsString()
  memberId!: string;

  @ApiPropertyOptional({ example: 'Sibling' })
  @IsOptional()
  @IsString()
  relationshipLabel?: string;
}
