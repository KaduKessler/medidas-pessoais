import { Module } from '@nestjs/common';
import { CodigoAcessoModule } from '../codigo-acesso/codigo-acesso.module';
import { MedidasController } from './medidas.controller';
import { MedidasService } from './medidas.service';

@Module({
  imports: [CodigoAcessoModule],
  providers: [MedidasService],
  controllers: [MedidasController],
})
export class MedidasModule {}
