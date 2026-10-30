import { PrismaService } from '@gps/data-access-db';
import {
  MembershipStatus,
  Message,
  Notification,
  NotificationTargetType,
  Prisma,
  UserNotification,
} from '@gps/data-access-prisma';
import { apiBadRequest, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ListMessagesQueryDto } from './dto/list-messages-query.dto';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationPreferenceResponseDto } from './dto/notification-preference-response.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

const PREFERENCE_EVENTS = ['TASK_ASSIGNED', 'TASK_REMINDER', 'APPROVAL_REQUESTED', 'APPROVAL_DECISION', 'DOCUMENT_RENEWAL', 'ADMISSION_UPDATE', 'FEE_REMINDER'];
const PREFERENCE_CHANNELS = ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'];

@Injectable()
export class CommunicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPreferences(user: AuthenticatedUser): Promise<NotificationPreferenceResponseDto[]> {
    const rows = await this.prisma.notificationPreference.findMany({ where: { tenantId: user.tenantId, userId: user.sub }, orderBy: [{ eventKey: 'asc' }, { channel: 'asc' }] });
    const existing = new Map(rows.map((row) => [`${row.eventKey}:${row.channel}`, row]));
    const now = new Date().toISOString();
    return PREFERENCE_EVENTS.flatMap((eventKey) => PREFERENCE_CHANNELS.map((channel) => {
      const row = existing.get(`${eventKey}:${channel}`);
      return { id: row?.id ?? `default:${eventKey}:${channel}`, eventKey, channel, enabled: row?.enabled ?? channel === 'IN_APP', updatedAt: row?.updatedAt.toISOString() ?? now };
    }));
  }

  async updatePreference(user: AuthenticatedUser, dto: UpdateNotificationPreferenceDto): Promise<NotificationPreferenceResponseDto> {
    const row = await this.prisma.notificationPreference.upsert({ where: { tenantId_userId_eventKey_channel: { tenantId: user.tenantId, userId: user.sub, eventKey: dto.eventKey, channel: dto.channel } }, create: { tenantId: user.tenantId, userId: user.sub, eventKey: dto.eventKey, channel: dto.channel, enabled: dto.enabled }, update: { enabled: dto.enabled } });
    await this.prisma.auditLog.create({ data: { tenantId: user.tenantId, actorUserId: user.sub, action: 'UPDATE', entityType: 'NOTIFICATION_PREFERENCE', entityId: row.id, message: `${dto.eventKey} ${dto.channel} ${dto.enabled ? 'enabled' : 'disabled'}`, newValues: { eventKey: dto.eventKey, channel: dto.channel, enabled: dto.enabled } } });
    return { id: row.id, eventKey: row.eventKey, channel: row.channel, enabled: row.enabled, updatedAt: row.updatedAt.toISOString() };
  }

  async listNotifications(
    user: AuthenticatedUser,
    query: ListNotificationsQueryDto,
  ): Promise<NotificationResponseDto[]> {
    const mineOnly = query.mineOnly !== 'false';

    const where: Prisma.NotificationWhereInput = {
      tenantId: user.tenantId,
      deletedAt: null,
      ...(query.schoolId ? { schoolId: query.schoolId } : {}),
      ...(query.targetType ? { targetType: query.targetType } : {}),
    };

    if (mineOnly) {
      where.OR = [
        { senderId: user.sub },
        { targetType: NotificationTargetType.ALL },
        {
          targetType: NotificationTargetType.USER,
          targetId: user.sub,
        },
        {
          reads: {
            some: {
              userId: user.sub,
              deletedAt: null,
            },
          },
        },
      ];
    }

    if (query.isRead === 'true') {
      where.reads = {
        some: {
          userId: user.sub,
          isRead: true,
          deletedAt: null,
        },
      };
    }

    if (query.isRead === 'false') {
      where.NOT = [
        {
          reads: {
            some: {
              userId: user.sub,
              isRead: true,
              deletedAt: null,
            },
          },
        },
      ];
    }

    const rows = await this.prisma.notification.findMany({
      where,
      include: {
        reads: {
          where: {
            userId: user.sub,
            deletedAt: null,
          },
          orderBy: [{ createdAt: 'desc' }],
          take: 1,
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toNotificationResponse(row, row.reads[0]));
  }

  async createNotification(
    user: AuthenticatedUser,
    dto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    if (dto.targetType === NotificationTargetType.USER && !dto.targetId) {
      throw apiBadRequest(
        'COMMUNICATIONS_NOTIFICATION_TARGET_ID_REQUIRED',
        'targetId is required when targetType is USER',
      );
    }

    const recipients = new Set(dto.recipientUserIds ?? []);
    if (dto.targetType === NotificationTargetType.USER && dto.targetId) {
      recipients.add(dto.targetId);
    }

    const recipientUserIds = Array.from(recipients);

    if (recipientUserIds.length > 0) {
      const memberships = await this.prisma.userTenant.findMany({
        where: {
          tenantId: user.tenantId,
          userId: { in: recipientUserIds },
          status: MembershipStatus.ACTIVE,
          deletedAt: null,
        },
        select: { userId: true },
      });

      const allowedUsers = new Set(memberships.map((m) => m.userId));
      const invalid = recipientUserIds.filter((id) => !allowedUsers.has(id));
      if (invalid.length > 0) {
        throw apiBadRequest(
          'COMMUNICATIONS_RECIPIENT_NOT_ACTIVE',
          'Recipient(s) not active in tenant',
          { invalidRecipientUserIds: invalid },
        );
      }
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const notification = await tx.notification.create({
        data: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          title: dto.title,
          messageBody: dto.messageBody,
          senderId: user.sub,
          targetType: dto.targetType,
          targetId: dto.targetId,
          scheduledFor: dto.scheduledFor ? new Date(dto.scheduledFor) : null,
        },
      });

      if (recipientUserIds.length > 0) {
        await tx.userNotification.createMany({
          data: recipientUserIds.map((recipientId) => ({
            tenantId: user.tenantId,
            notificationId: notification.id,
            userId: recipientId,
            isRead: false,
          })),
          skipDuplicates: true,
        });
      }

      return tx.notification.findUniqueOrThrow({
        where: { id: notification.id },
        include: {
          reads: {
            where: {
              userId: user.sub,
              deletedAt: null,
            },
            take: 1,
          },
        },
      });
    });

    return this.toNotificationResponse(created, created.reads[0]);
  }

  async markNotificationRead(
    user: AuthenticatedUser,
    notificationId: string,
  ): Promise<NotificationResponseDto> {
    const existing = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw apiNotFound('COMMUNICATIONS_NOTIFICATION_NOT_FOUND', 'Notification not found', {
        notificationId,
      });
    }

    const now = new Date();

    await this.prisma.userNotification.upsert({
      where: {
        notificationId_userId: {
          notificationId,
          userId: user.sub,
        },
      },
      create: {
        tenantId: user.tenantId,
        notificationId,
        userId: user.sub,
        isRead: true,
        readAt: now,
      },
      update: {
        isRead: true,
        readAt: now,
      },
    });

    const row = await this.prisma.notification.findUniqueOrThrow({
      where: { id: notificationId },
      include: {
        reads: {
          where: {
            userId: user.sub,
            deletedAt: null,
          },
          take: 1,
        },
      },
    });

    return this.toNotificationResponse(row, row.reads[0]);
  }

  async listMessages(
    user: AuthenticatedUser,
    query: ListMessagesQueryDto,
  ): Promise<MessageResponseDto[]> {
    const direction = query.direction ?? 'all';

    const directionFilter: Prisma.MessageWhereInput =
      direction === 'inbox'
        ? { recipientId: user.sub }
        : direction === 'sent'
          ? { senderId: user.sub }
          : {
              OR: [{ senderId: user.sub }, { recipientId: user.sub }],
            };

    const withUserFilter: Prisma.MessageWhereInput | undefined = query.withUserId
      ? {
          OR: [
            { senderId: user.sub, recipientId: query.withUserId },
            { senderId: query.withUserId, recipientId: user.sub },
          ],
        }
      : undefined;

    const where: Prisma.MessageWhereInput = {
      tenantId: user.tenantId,
      deletedAt: null,
      ...(query.schoolId ? { schoolId: query.schoolId } : {}),
      AND: [directionFilter, ...(withUserFilter ? [withUserFilter] : [])],
    };

    const rows = await this.prisma.message.findMany({
      where,
      orderBy: [{ sentAt: 'desc' }],
    });

    return rows.map((row) => this.toMessageResponse(row));
  }

  async createMessage(
    user: AuthenticatedUser,
    dto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const recipientMembership = await this.prisma.userTenant.findFirst({
      where: {
        tenantId: user.tenantId,
        userId: dto.recipientId,
        status: MembershipStatus.ACTIVE,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!recipientMembership) {
      throw apiBadRequest(
        'COMMUNICATIONS_RECIPIENT_NOT_ACTIVE',
        'Recipient is not active in this tenant',
        { recipientId: dto.recipientId },
      );
    }

    const row = await this.prisma.message.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        senderId: user.sub,
        recipientId: dto.recipientId,
        body: dto.body,
      },
    });

    return this.toMessageResponse(row);
  }

  private toNotificationResponse(
    row: Notification,
    read: UserNotification | undefined,
  ): NotificationResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      title: row.title,
      messageBody: row.messageBody,
      senderId: row.senderId,
      targetType: row.targetType,
      targetId: row.targetId,
      scheduledFor: row.scheduledFor ? row.scheduledFor.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
      isRead: read?.isRead ?? false,
      readAt: read?.readAt ? read.readAt.toISOString() : null,
    };
  }

  private toMessageResponse(row: Message): MessageResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      senderId: row.senderId,
      recipientId: row.recipientId,
      body: row.body,
      sentAt: row.sentAt.toISOString(),
    };
  }
}
