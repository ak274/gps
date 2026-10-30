import { ApiProperty } from '@nestjs/swagger';

export class NotificationPreferenceResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() eventKey!: string;
  @ApiProperty() channel!: string;
  @ApiProperty() enabled!: boolean;
  @ApiProperty() updatedAt!: string;
}
