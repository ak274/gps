import { PrismaService } from '@gps/data-access-db';
import {
  Prisma,
  StudentTransportAssignment,
  TransportRoute,
  TransportStop,
  TransportVehicle,
} from '@gps/data-access-prisma';
import { apiConflict, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateTransportAssignmentDto } from './dto/create-transport-assignment.dto';
import { CreateTransportRouteDto } from './dto/create-transport-route.dto';
import { CreateTransportStopDto } from './dto/create-transport-stop.dto';
import { CreateTransportVehicleDto } from './dto/create-transport-vehicle.dto';
import { ListTransportAssignmentsQueryDto } from './dto/list-transport-assignments-query.dto';
import { ListTransportRoutesQueryDto } from './dto/list-transport-routes-query.dto';
import { ListTransportStopsQueryDto } from './dto/list-transport-stops-query.dto';
import { ListTransportVehiclesQueryDto } from './dto/list-transport-vehicles-query.dto';
import { TransportAssignmentResponseDto } from './dto/transport-assignment-response.dto';
import { TransportRouteResponseDto } from './dto/transport-route-response.dto';
import { TransportStopResponseDto } from './dto/transport-stop-response.dto';
import { TransportVehicleResponseDto } from './dto/transport-vehicle-response.dto';
import { UpdateTransportAssignmentDto } from './dto/update-transport-assignment.dto';
import { UpdateTransportRouteDto } from './dto/update-transport-route.dto';
import { UpdateTransportStopDto } from './dto/update-transport-stop.dto';
import { UpdateTransportVehicleDto } from './dto/update-transport-vehicle.dto';

@Injectable()
export class TransportService {
  constructor(private readonly prisma: PrismaService) {}

  async listVehicles(user: AuthenticatedUser, query: ListTransportVehiclesQueryDto) {
    const rows = await this.prisma.transportVehicle.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.search
          ? {
              OR: [
                { vehicleNumber: { contains: query.search, mode: 'insensitive' } },
                { vehicleType: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toVehicleResponse(row));
  }

  async createVehicle(user: AuthenticatedUser, dto: CreateTransportVehicleDto) {
    const duplicate = await this.prisma.transportVehicle.findFirst({
      where: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        vehicleNumber: dto.vehicleNumber,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (duplicate)
      throw apiConflict('TRANSPORT_VEHICLE_NUMBER_CONFLICT', 'Vehicle number already exists for school', {
        schoolId: dto.schoolId,
        vehicleNumber: dto.vehicleNumber,
      });

    const row = await this.prisma.transportVehicle.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        vehicleNumber: dto.vehicleNumber,
        vehicleType: dto.vehicleType,
        capacity: dto.capacity,
        gpsDeviceId: dto.gpsDeviceId,
      },
    });

    return this.toVehicleResponse(row);
  }

  async updateVehicle(user: AuthenticatedUser, vehicleId: string, dto: UpdateTransportVehicleDto) {
    await this.ensureVehicle(user, vehicleId);

    const row = await this.prisma.transportVehicle.update({
      where: { id: vehicleId },
      data: {
        ...(dto.vehicleType !== undefined ? { vehicleType: dto.vehicleType } : {}),
        ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
        ...(dto.gpsDeviceId !== undefined ? { gpsDeviceId: dto.gpsDeviceId } : {}),
      },
    });

    return this.toVehicleResponse(row);
  }

  async listRoutes(user: AuthenticatedUser, query: ListTransportRoutesQueryDto) {
    const rows = await this.prisma.transportRoute.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.vehicleId ? { vehicleId: query.vehicleId } : {}),
        ...(query.search
          ? {
              OR: [
                { code: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toRouteResponse(row));
  }

  async createRoute(user: AuthenticatedUser, dto: CreateTransportRouteDto) {
    const duplicate = await this.prisma.transportRoute.findFirst({
      where: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        code: dto.code,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (duplicate)
      throw apiConflict('TRANSPORT_ROUTE_CODE_CONFLICT', 'Route code already exists for school', {
        schoolId: dto.schoolId,
        code: dto.code,
      });

    const row = await this.prisma.transportRoute.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        code: dto.code,
        name: dto.name,
        vehicleId: dto.vehicleId,
      },
    });

    return this.toRouteResponse(row);
  }

  async updateRoute(user: AuthenticatedUser, routeId: string, dto: UpdateTransportRouteDto) {
    await this.ensureRoute(user, routeId);

    const row = await this.prisma.transportRoute.update({
      where: { id: routeId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.vehicleId !== undefined ? { vehicleId: dto.vehicleId } : {}),
      },
    });

    return this.toRouteResponse(row);
  }

  async listStops(user: AuthenticatedUser, query: ListTransportStopsQueryDto) {
    const where: Prisma.TransportStopWhereInput = {
      tenantId: user.tenantId,
      deletedAt: null,
      ...(query.routeId ? { routeId: query.routeId } : {}),
      ...(query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {}),
    };

    const rows = await this.prisma.transportStop.findMany({
      where,
      orderBy: [{ sequenceNo: 'asc' }],
    });

    return rows.map((row) => this.toStopResponse(row));
  }

  async createStop(user: AuthenticatedUser, dto: CreateTransportStopDto) {
    const route = await this.prisma.transportRoute.findFirst({
      where: { id: dto.routeId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!route) throw apiNotFound('TRANSPORT_ROUTE_NOT_FOUND', 'Route not found', { routeId: dto.routeId });

    const row = await this.prisma.transportStop.create({
      data: {
        tenantId: user.tenantId,
        routeId: dto.routeId,
        name: dto.name,
        sequenceNo: dto.sequenceNo,
      },
    });

    return this.toStopResponse(row);
  }

  async updateStop(user: AuthenticatedUser, stopId: string, dto: UpdateTransportStopDto) {
    await this.ensureStop(user, stopId);

    const row = await this.prisma.transportStop.update({
      where: { id: stopId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.sequenceNo !== undefined ? { sequenceNo: dto.sequenceNo } : {}),
      },
    });

    return this.toStopResponse(row);
  }

  async listAssignments(user: AuthenticatedUser, query: ListTransportAssignmentsQueryDto) {
    const where: Prisma.StudentTransportAssignmentWhereInput = {
      tenantId: user.tenantId,
      deletedAt: null,
      ...(query.studentId ? { studentId: query.studentId } : {}),
      ...(query.routeId ? { routeId: query.routeId } : {}),
      ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    const rows = await this.prisma.studentTransportAssignment.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toAssignmentResponse(row));
  }

  async createAssignment(user: AuthenticatedUser, dto: CreateTransportAssignmentDto) {
    const duplicate = await this.prisma.studentTransportAssignment.findFirst({
      where: {
        tenantId: user.tenantId,
        studentId: dto.studentId,
        academicYearId: dto.academicYearId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (duplicate)
      throw apiConflict(
        'TRANSPORT_ASSIGNMENT_CONFLICT',
        'Student transport assignment already exists for academic year',
        {
          studentId: dto.studentId,
          academicYearId: dto.academicYearId,
        },
      );

    const row = await this.prisma.studentTransportAssignment.create({
      data: {
        tenantId: user.tenantId,
        studentId: dto.studentId,
        routeId: dto.routeId,
        stopId: dto.stopId,
        academicYearId: dto.academicYearId,
        startsOn: new Date(dto.startsOn),
        status: dto.status,
        endsOn: dto.endsOn ? new Date(dto.endsOn) : null,
      },
    });

    return this.toAssignmentResponse(row);
  }

  async updateAssignment(
    user: AuthenticatedUser,
    assignmentId: string,
    dto: UpdateTransportAssignmentDto,
  ) {
    await this.ensureAssignment(user, assignmentId);

    const row = await this.prisma.studentTransportAssignment.update({
      where: { id: assignmentId },
      data: {
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.routeId !== undefined ? { routeId: dto.routeId } : {}),
        ...(dto.stopId !== undefined ? { stopId: dto.stopId } : {}),
        ...(dto.endsOn !== undefined ? { endsOn: new Date(dto.endsOn) } : {}),
      },
    });

    return this.toAssignmentResponse(row);
  }

  private async ensureVehicle(user: AuthenticatedUser, id: string) {
    const exists = await this.prisma.transportVehicle.findFirst({
      where: { id, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!exists) throw apiNotFound('TRANSPORT_VEHICLE_NOT_FOUND', 'Transport vehicle not found', { vehicleId: id });
  }

  private async ensureRoute(user: AuthenticatedUser, id: string) {
    const exists = await this.prisma.transportRoute.findFirst({
      where: { id, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!exists) throw apiNotFound('TRANSPORT_ROUTE_NOT_FOUND', 'Transport route not found', { routeId: id });
  }

  private async ensureStop(user: AuthenticatedUser, id: string) {
    const exists = await this.prisma.transportStop.findFirst({
      where: { id, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!exists) throw apiNotFound('TRANSPORT_STOP_NOT_FOUND', 'Transport stop not found', { stopId: id });
  }

  private async ensureAssignment(user: AuthenticatedUser, id: string) {
    const exists = await this.prisma.studentTransportAssignment.findFirst({
      where: { id, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!exists)
      throw apiNotFound('TRANSPORT_ASSIGNMENT_NOT_FOUND', 'Transport assignment not found', {
        assignmentId: id,
      });
  }

  private toVehicleResponse(row: TransportVehicle): TransportVehicleResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      vehicleNumber: row.vehicleNumber,
      vehicleType: row.vehicleType,
      capacity: row.capacity,
      gpsDeviceId: row.gpsDeviceId,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private toRouteResponse(row: TransportRoute): TransportRouteResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      code: row.code,
      name: row.name,
      vehicleId: row.vehicleId,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private toStopResponse(row: TransportStop): TransportStopResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      routeId: row.routeId,
      name: row.name,
      sequenceNo: row.sequenceNo,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private toAssignmentResponse(
    row: StudentTransportAssignment,
  ): TransportAssignmentResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      studentId: row.studentId,
      routeId: row.routeId,
      stopId: row.stopId,
      academicYearId: row.academicYearId,
      status: row.status,
      startsOn: row.startsOn.toISOString(),
      endsOn: row.endsOn ? row.endsOn.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
