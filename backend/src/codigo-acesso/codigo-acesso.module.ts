import { Module } from '@nestjs/common';
import { CodigoAcessoController } from './codigo-acesso.controller';
import { CodigoAcessoService } from './codigo-acesso.service';
import { MedidasPublicasController } from './medidas-publicas.controller';

@Module({
  providers: [CodigoAcessoService],
  controllers: [CodigoAcessoController, MedidasPublicasController],
  exports: [CodigoAcessoService],
})
export class CodigoAcessoModule {}
