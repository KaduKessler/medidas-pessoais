import { Module } from '@nestjs/common';
import { MedidasController } from './medidas.controller';
import { MedidasService } from './medidas.service';

@Module({
  providers: [MedidasService],
  controllers: [MedidasController],
})
export class MedidasModule {}
