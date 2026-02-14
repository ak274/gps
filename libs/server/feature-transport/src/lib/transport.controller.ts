import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
import { TransportService } from './transport.service';

@ApiTags('transport')
@ApiBearerAuth()
@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @ApiOperation({ summary: 'List transport vehicles in authenticated tenant' })
  @ApiOkResponse({ type: [TransportVehicleResponseDto] })
  @Scopes('transport.vehicles.read')
  @Get('vehicles')
  listVehicles(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListTransportVehiclesQueryDto,
  ) {
    return this.transportService.listVehicles(user, query);
  }

  @ApiOperation({ summary: 'Create transport vehicle' })
  @ApiOkResponse({ type: TransportVehicleResponseDto })
  @ApiConflictResponse({ description: 'Duplicate vehicle number in school' })
  @Scopes('transport.vehicles.write')
  @Post('vehicles')
  createVehicle(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTransportVehicleDto,
  ) {
    return this.transportService.createVehicle(user, dto);
  }

  @ApiOperation({ summary: 'Update transport vehicle' })
  @ApiOkResponse({ type: TransportVehicleResponseDto })
  @ApiNotFoundResponse({ description: 'Transport vehicle not found' })
  @Scopes('transport.vehicles.write')
  @Patch('vehicles/:vehicleId')
  updateVehicle(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpdateTransportVehicleDto,
  ) {
    return this.transportService.updateVehicle(user, vehicleId, dto);
  }

  @ApiOperation({ summary: 'List transport routes in authenticated tenant' })
  @ApiOkResponse({ type: [TransportRouteResponseDto] })
  @Scopes('transport.routes.read')
  @Get('routes')
  listRoutes(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListTransportRoutesQueryDto,
  ) {
    return this.transportService.listRoutes(user, query);
  }

  @ApiOperation({ summary: 'Create transport route' })
  @ApiOkResponse({ type: TransportRouteResponseDto })
  @ApiConflictResponse({ description: 'Duplicate route code in school' })
  @Scopes('transport.routes.write')
  @Post('routes')
  createRoute(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTransportRouteDto,
  ) {
    return this.transportService.createRoute(user, dto);
  }

  @ApiOperation({ summary: 'Update transport route' })
  @ApiOkResponse({ type: TransportRouteResponseDto })
  @ApiNotFoundResponse({ description: 'Transport route not found' })
  @Scopes('transport.routes.write')
  @Patch('routes/:routeId')
  updateRoute(
    @CurrentUser() user: AuthenticatedUser,
    @Param('routeId') routeId: string,
    @Body() dto: UpdateTransportRouteDto,
  ) {
    return this.transportService.updateRoute(user, routeId, dto);
  }

  @ApiOperation({ summary: 'List transport stops in authenticated tenant' })
  @ApiOkResponse({ type: [TransportStopResponseDto] })
  @Scopes('transport.stops.read')
  @Get('stops')
  listStops(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListTransportStopsQueryDto,
  ) {
    return this.transportService.listStops(user, query);
  }

  @ApiOperation({ summary: 'Create transport stop' })
  @ApiOkResponse({ type: TransportStopResponseDto })
  @ApiNotFoundResponse({ description: 'Route not found' })
  @Scopes('transport.stops.write')
  @Post('stops')
  createStop(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTransportStopDto,
  ) {
    return this.transportService.createStop(user, dto);
  }

  @ApiOperation({ summary: 'Update transport stop' })
  @ApiOkResponse({ type: TransportStopResponseDto })
  @ApiNotFoundResponse({ description: 'Transport stop not found' })
  @Scopes('transport.stops.write')
  @Patch('stops/:stopId')
  updateStop(
    @CurrentUser() user: AuthenticatedUser,
    @Param('stopId') stopId: string,
    @Body() dto: UpdateTransportStopDto,
  ) {
    return this.transportService.updateStop(user, stopId, dto);
  }

  @ApiOperation({ summary: 'List student transport assignments in authenticated tenant' })
  @ApiOkResponse({ type: [TransportAssignmentResponseDto] })
  @Scopes('transport.assignments.read')
  @Get('assignments')
  listAssignments(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListTransportAssignmentsQueryDto,
  ) {
    return this.transportService.listAssignments(user, query);
  }

  @ApiOperation({ summary: 'Create student transport assignment' })
  @ApiOkResponse({ type: TransportAssignmentResponseDto })
  @ApiConflictResponse({ description: 'Duplicate student assignment for academic year' })
  @Scopes('transport.assignments.write')
  @Post('assignments')
  createAssignment(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTransportAssignmentDto,
  ) {
    return this.transportService.createAssignment(user, dto);
  }

  @ApiOperation({ summary: 'Update student transport assignment' })
  @ApiOkResponse({ type: TransportAssignmentResponseDto })
  @ApiNotFoundResponse({ description: 'Transport assignment not found' })
  @Scopes('transport.assignments.write')
  @Patch('assignments/:assignmentId')
  updateAssignment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('assignmentId') assignmentId: string,
    @Body() dto: UpdateTransportAssignmentDto,
  ) {
    return this.transportService.updateAssignment(user, assignmentId, dto);
  }
}
