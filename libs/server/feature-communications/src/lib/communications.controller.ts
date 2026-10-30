import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CommunicationsService } from './communications.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ListMessagesQueryDto } from './dto/list-messages-query.dto';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationPreferenceResponseDto } from './dto/notification-preference-response.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

@ApiTags('communications')
@ApiBearerAuth()
@Controller('communications')
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {}

  @ApiOperation({ summary: 'List notification preferences for the current user' })
  @ApiOkResponse({ type: [NotificationPreferenceResponseDto] })
  @Scopes('communications.notifications.read')
  @Get('notifications/preferences')
  listPreferences(@CurrentUser() user: AuthenticatedUser) {
    return this.communicationsService.listPreferences(user);
  }

  @ApiOperation({ summary: 'Update one notification preference for the current user' })
  @ApiOkResponse({ type: NotificationPreferenceResponseDto })
  @Scopes('communications.notifications.write')
  @Post('notifications/preferences')
  updatePreference(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateNotificationPreferenceDto) {
    return this.communicationsService.updatePreference(user, dto);
  }

  @ApiOperation({ summary: 'List notifications in authenticated tenant context' })
  @ApiOkResponse({ type: [NotificationResponseDto] })
  @Scopes('communications.notifications.read')
  @Get('notifications')
  listNotifications(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListNotificationsQueryDto,
  ) {
    return this.communicationsService.listNotifications(user, query);
  }

  @ApiOperation({ summary: 'Create notification and optionally seed recipients' })
  @ApiOkResponse({ type: NotificationResponseDto })
  @Scopes('communications.notifications.write')
  @Post('notifications')
  createNotification(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.communicationsService.createNotification(user, dto);
  }

  @ApiOperation({ summary: 'Mark notification as read for current user' })
  @ApiOkResponse({ type: NotificationResponseDto })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @Scopes('communications.notifications.read')
  @Post('notifications/:notificationId/read')
  markNotificationRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('notificationId') notificationId: string,
  ) {
    return this.communicationsService.markNotificationRead(user, notificationId);
  }

  @ApiOperation({ summary: 'List direct messages for current user in authenticated tenant' })
  @ApiOkResponse({ type: [MessageResponseDto] })
  @Scopes('communications.messages.read')
  @Get('messages')
  listMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListMessagesQueryDto,
  ) {
    return this.communicationsService.listMessages(user, query);
  }

  @ApiOperation({ summary: 'Create direct message from current user to recipient user' })
  @ApiOkResponse({ type: MessageResponseDto })
  @Scopes('communications.messages.write')
  @Post('messages')
  createMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMessageDto,
  ) {
    return this.communicationsService.createMessage(user, dto);
  }
}
