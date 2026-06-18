import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  // CSP fica off só em /reference: Scalar injeta script/CSS inline e CSP padrão bloquearia a página
  const helmetWithCsp = helmet();
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/reference')) return next();
    return helmetWithCsp(req, res, next);
  });

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
    .addBearerAuth()
    .addTag('health', 'Monitoramento e diagnóstico da aplicação')
    .addTag('auth', 'Autenticação e emissão de token JWT')
    .addTag('usuarios', 'Gerenciamento de conta do usuário')
    .addTag('medidas', 'Cadastro e consulta de medidas corporais')
    .addTag('codigo-acesso', 'Geração e consulta do código de acesso (MED-XXXXX)')
    .addTag('api-publica', 'Consulta de medidas pelo código de acesso, sem autenticação');

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
