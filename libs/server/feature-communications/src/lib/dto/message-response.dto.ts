import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  senderId!: string;

  @ApiProperty()
  recipientId!: string;

  @ApiProperty()
  body!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  sentAt!: string;
}
