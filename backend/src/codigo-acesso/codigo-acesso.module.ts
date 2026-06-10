import { Module } from '@nestjs/common';
import { CodigoAcessoController } from './codigo-acesso.controller';
import { CodigoAcessoService } from './codigo-acesso.service';

@Module({
  providers: [CodigoAcessoService],
  controllers: [CodigoAcessoController],
})
export class CodigoAcessoModule {}
