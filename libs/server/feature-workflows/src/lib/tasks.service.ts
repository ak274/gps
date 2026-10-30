import { PrismaService } from '@gps/data-access-db';
import { MembershipStatus, NotificationTargetType, Prisma, Task, TaskStatus } from '@gps/data-access-prisma';
import { apiBadRequest, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskReminderDto } from './dto/create-task-reminder.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListTasksQueryDto): Promise<TaskResponseDto[]> {
    const schoolId = query.schoolId;
    const now = new Date();
    const where: Prisma.TaskWhereInput = {
      tenantId: user.tenantId,
      deletedAt: null,
      ...(schoolId ? { schoolId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.mineOnly === 'true' ? { assigneeId: user.sub } : {}),
      ...(query.overdue === 'true'
        ? { dueAt: { lt: now }, status: { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] } }
        : {}),
    };

    const rows = await this.prisma.task.findMany({
      where,
      include: {
        assignee: { select: { firstName: true, lastName: true } },
        reminders: { select: { id: true } },
      },
      orderBy: [{ status: 'asc' }, { dueAt: 'asc' }, { createdAt: 'desc' }],
    });
    return rows.map((row) => this.toResponse(row));
  }

  async create(user: AuthenticatedUser, dto: CreateTaskDto): Promise<TaskResponseDto> {
    await this.ensureSchool(user, dto.schoolId);
    const assigneeId = dto.assigneeId ?? user.sub;
    await this.ensureActiveUser(user, assigneeId);
    const task = await this.prisma.$transaction(async (tx) => {
      const created = await tx.task.create({
        data: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          title: dto.title,
          description: dto.description,
          type: dto.type,
          priority: dto.priority,
          assigneeId,
          createdById: user.sub,
          sourceType: dto.sourceType,
          sourceId: dto.sourceId,
          actionUrl: dto.actionUrl,
          dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
        },
      });
      if (dto.reminderAt) {
        await tx.taskReminder.create({
          data: { tenantId: user.tenantId, taskId: created.id, userId: assigneeId, remindAt: new Date(dto.reminderAt) },
        });
      }
      await tx.notification.create({
        data: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          title: 'New task assigned',
          messageBody: dto.title,
          senderId: user.sub,
          targetType: NotificationTargetType.USER,
          targetId: assigneeId,
          reads: { create: { tenantId: user.tenantId, userId: assigneeId } },
        },
      });
      return tx.task.findUniqueOrThrow({
        where: { id: created.id },
        include: { assignee: { select: { firstName: true, lastName: true } }, reminders: { select: { id: true } } },
      });
    });
    return this.toResponse(task);
  }

  async updateStatus(user: AuthenticatedUser, taskId: string, dto: UpdateTaskStatusDto): Promise<TaskResponseDto> {
    const task = await this.ensureTask(user, taskId);
    const isCompleted = dto.status === TaskStatus.COMPLETED;
    const updated = await this.prisma.task.update({
      where: { id: task.id },
      data: {
        status: dto.status,
        completedAt: isCompleted ? new Date() : null,
        completedById: isCompleted ? user.sub : null,
      },
      include: { assignee: { select: { firstName: true, lastName: true } }, reminders: { select: { id: true } } },
    });
    return this.toResponse(updated);
  }

  async addReminder(user: AuthenticatedUser, taskId: string, dto: CreateTaskReminderDto): Promise<TaskResponseDto> {
    const task = await this.ensureTask(user, taskId);
    const userId = dto.userId ?? task.assigneeId ?? user.sub;
    await this.ensureActiveUser(user, userId);
    await this.prisma.taskReminder.create({ data: { tenantId: user.tenantId, taskId, userId, remindAt: new Date(dto.remindAt) } });
    return this.getById(user, taskId);
  }

  async runDueReminders(user: AuthenticatedUser): Promise<{ processed: number }> {
    const due = await this.prisma.taskReminder.findMany({
      where: { tenantId: user.tenantId, sentAt: null, remindAt: { lte: new Date() }, task: { deletedAt: null, status: { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] } } },
      include: { task: true },
      take: 100,
    });
    let processed = 0;
    for (const reminder of due) {
      await this.prisma.$transaction(async (tx) => {
        const marked = await tx.taskReminder.updateMany({ where: { id: reminder.id, sentAt: null }, data: { sentAt: new Date() } });
        if (marked.count === 0) return;
        await tx.notification.create({
          data: {
            tenantId: user.tenantId,
            schoolId: reminder.task.schoolId,
            title: 'Task reminder',
            messageBody: reminder.task.title,
            senderId: user.sub,
            targetType: NotificationTargetType.USER,
            targetId: reminder.userId,
            reads: { create: { tenantId: user.tenantId, userId: reminder.userId } },
          },
        });
        processed += 1;
      });
    }
    return { processed };
  }

  async getById(user: AuthenticatedUser, taskId: string): Promise<TaskResponseDto> {
    const task = await this.ensureTask(user, taskId);
    const row = await this.prisma.task.findUniqueOrThrow({ where: { id: task.id }, include: { assignee: { select: { firstName: true, lastName: true } }, reminders: { select: { id: true } } } });
    return this.toResponse(row);
  }

  private async ensureSchool(user: AuthenticatedUser, schoolId: string) {
    const school = await this.prisma.school.findFirst({ where: { id: schoolId, tenantId: user.tenantId, deletedAt: null } });
    if (!school) throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found in the authenticated tenant');
  }

  private async ensureActiveUser(user: AuthenticatedUser, userId: string) {
    const membership = await this.prisma.userTenant.findFirst({ where: { tenantId: user.tenantId, userId, status: MembershipStatus.ACTIVE, deletedAt: null } });
    if (!membership) throw apiBadRequest('TASK_ASSIGNEE_NOT_ACTIVE', 'Task assignee is not active in the authenticated tenant');
  }

  private async ensureTask(user: AuthenticatedUser, taskId: string) {
    const task = await this.prisma.task.findFirst({ where: { id: taskId, tenantId: user.tenantId, deletedAt: null } });
    if (!task) throw apiNotFound('TASK_NOT_FOUND', 'Task not found');
    return task;
  }

  private toResponse(row: Task & { assignee?: { firstName: string; lastName: string | null } | null; reminders?: { id: string }[] }): TaskResponseDto {
    const now = new Date();
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      title: row.title,
      description: row.description,
      type: row.type,
      status: row.status,
      priority: row.priority,
      assigneeId: row.assigneeId,
      assigneeName: row.assignee ? `${row.assignee.firstName} ${row.assignee.lastName ?? ''}`.trim() : null,
      createdById: row.createdById,
      sourceType: row.sourceType,
      sourceId: row.sourceId,
      actionUrl: row.actionUrl,
      dueAt: row.dueAt?.toISOString() ?? null,
      completedAt: row.completedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      isOverdue: Boolean(row.dueAt && row.dueAt < now && row.status !== TaskStatus.COMPLETED && row.status !== TaskStatus.CANCELLED),
      reminderCount: row.reminders?.length ?? 0,
    };
  }
}
