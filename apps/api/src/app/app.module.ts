import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '@gps/data-access-db';
import { AcademicsModule } from '@gps/feature-academics';
import { AttendanceModule } from '@gps/feature-attendance';
import { BillingModule } from '@gps/feature-billing';
import { CommunicationsModule } from '@gps/feature-communications';
import { DocumentsModule } from '@gps/feature-documents';
import { AuthModule } from '@gps/feature-auth';
import { GuardiansModule } from '@gps/feature-guardians';
import { ExamsModule } from '@gps/feature-exams';
import { HomeworkModule } from '@gps/feature-homework';
import { AdmissionsModule } from '@gps/feature-admissions';
import { StudentLifecycleModule } from '@gps/feature-student-lifecycle';
import { RbacModule } from '@gps/feature-rbac';
import { SchoolsModule } from '@gps/feature-schools';
import { StaffModule } from '@gps/feature-staff';
import { StudentsModule } from '@gps/feature-students';
import { TenantsModule } from '@gps/feature-tenants';
import { TimetableModule } from '@gps/feature-timetable';
import { TransportModule } from '@gps/feature-transport';
import { WorkflowsModule } from '@gps/feature-workflows';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';
import type { DestinationStream } from 'pino';
import { AppController } from './app.controller';
import { validateEnv } from './config/env.schema';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    LoggerModule.forRoot({
      pinoHttp: (() => {
        const isProd = process.env.NODE_ENV === 'production';
        const redactPaths: string[] = [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.body.password',
          'req.body.passwordHash',
          'req.body.refreshToken',
        ];

        const base = {
          level: process.env.LOG_LEVEL ?? 'info',
          redact: {
            paths: redactPaths,
            remove: true,
          },
        };

        if (isProd) {
          return base;
        }

        // Avoid pino "transport" in bundled builds (worker files are not emitted by webpack).
        const pinoPretty = require('pino-pretty') as (
          opts: Record<string, unknown>,
        ) => DestinationStream;
        return {
          ...base,
          stream: pinoPretty({
            singleLine: true,
            colorize: true,
            translateTime: 'SYS:standard',
          }),
        };
      })(),
    }),
    PrismaModule,
    AcademicsModule,
    AttendanceModule,
    BillingModule,
    CommunicationsModule,
    DocumentsModule,
    AuthModule,
    GuardiansModule,
    ExamsModule,
    HomeworkModule,
    AdmissionsModule,
    StudentLifecycleModule,
    RbacModule,
    TenantsModule,
    SchoolsModule,
    StaffModule,
    StudentsModule,
    TimetableModule,
    TransportModule,
    WorkflowsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
  ],
})
export class AppModule {}
