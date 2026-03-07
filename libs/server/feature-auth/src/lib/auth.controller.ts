import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { Scopes } from './decorators/scopes.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { AuthenticatedUserDto } from './dto/me-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignUpDto } from './dto/signup.dto';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticate user and issue access/refresh tokens' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Create user account and issue access/refresh tokens' })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Tenant invalid or disabled' })
  @Public()
  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Refresh JWT using refresh token rotation' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke current authenticated session' })
  @ApiBody({ type: LogoutDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @Post('logout')
  logout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: LogoutDto,
  ) {
    return this.authService.logout(user, dto.refreshToken);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user payload' })
  @ApiOkResponse({ type: AuthenticatedUserDto })
  @Scopes('auth.read')
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
