/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { ApiExceptionFilter } from './app/common/filters/api-exception.filter';
import { validationExceptionFactory } from './app/common/validation/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = Number(process.env.PORT || 3000);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('GPS API')
    .setDescription('School management backend APIs')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}`, 'local')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token',
      },
      'bearer',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}_${methodKey}`,
  });
  SwaggerModule.setup(`${globalPrefix}/docs`, app, swaggerDocument, {
    customSiteTitle: 'GPS API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(port);
  app.get(Logger).log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  app.get(Logger).log(
    `Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`,
  );
  app.get(Logger).log(
    `OpenAPI JSON available at: http://localhost:${port}/${globalPrefix}/docs-json`,
  );
}

bootstrap();
