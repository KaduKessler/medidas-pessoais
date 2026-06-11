import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.FRONTEND_URL ?? '*' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? '3000';
  const isDev = process.env.NODE_ENV !== 'production';

  const builder = new DocumentBuilder()
    .setTitle('Medidas Pessoais API')
    .setDescription('API para registro e consulta de medidas corporais')
    .setVersion('1.0')
    .addBearerAuth();

  if (isDev) {
    builder.addServer(`http://localhost:${port}`, 'Development');
  }

  if (process.env.API_URL) {
    builder.addServer(process.env.API_URL, 'Production');
  }

  const config = builder.build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({
      spec: { content: document },
      theme: 'bluePlanet',
      darkMode: true,
      hideDownloadButton: !isDev,
      persistAuth: true,
      telemetry: false,
      _integration: 'nestjs',
      defaultHttpClient: {
        targetKey: 'shell',
        clientKey: 'curl',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
