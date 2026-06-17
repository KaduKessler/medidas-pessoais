import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CodigoAcessoModule } from './codigo-acesso/codigo-acesso.module';
import { HealthModule } from './health/health.module';
import { MedidasModule } from './medidas/medidas.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    MedidasModule,
    CodigoAcessoModule,
    HealthModule,
  ],
})
export class AppModule {}
