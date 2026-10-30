import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsString, Length } from 'class-validator';

export class UpdateNotificationPreferenceDto {
  @ApiProperty({ example: 'DOCUMENT_RENEWAL' })
  @IsString()
  @Length(2, 80)
  eventKey!: string;

  @ApiProperty({ enum: ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'] })
  @IsIn(['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'])
  channel!: string;

  @ApiProperty()
  @IsBoolean()
  enabled!: boolean;
}
