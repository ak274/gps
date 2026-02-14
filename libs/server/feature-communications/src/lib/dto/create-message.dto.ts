import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty()
  @IsString()
  recipientId!: string;

  @ApiProperty()
  @IsString()
  @Length(1, 4000)
  body!: string;
}
