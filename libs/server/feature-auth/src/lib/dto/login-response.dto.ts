import { ApiProperty } from '@nestjs/swagger';
import { AuthenticatedUserDto } from './me-response.dto';

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: string;

  @ApiProperty({ example: '15m' })
  expiresIn!: string;

  @ApiProperty({ example: '30d' })
  refreshExpiresIn!: string;

  @ApiProperty({ type: AuthenticatedUserDto })
  user!: AuthenticatedUserDto;
}
