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
import { RbacModule } from '@gps/feature-rbac';
import { SchoolsModule } from '@gps/feature-schools';
import { StaffModule } from '@gps/feature-staff';
import { StudentsModule } from '@gps/feature-students';
import { TenantsModule } from '@gps/feature-tenants';
import { TimetableModule } from '@gps/feature-timetable';
import { TransportModule } from '@gps/feature-transport';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';
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
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.passwordHash',
            'req.body.refreshToken',
          ],
          remove: true,
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'SYS:standard',
                },
              }
            : undefined,
      },
    }),
    PrismaModule,
    AcademicsModule,
    AttendanceModule,
    BillingModule,
    CommunicationsModule,
    DocumentsModule,
    AuthModule,
    GuardiansModule,
    RbacModule,
    TenantsModule,
    SchoolsModule,
    StaffModule,
    StudentsModule,
    TimetableModule,
    TransportModule,
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
