// biome-ignore-all lint/style/useImportType: classe injetada via DI do Nest precisa de import de valor (reflect-metadata)
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CodigoAcessoService } from './codigo-acesso.service';

@ApiTags('api-publica')
@Controller('api/medidas')
export class MedidasPublicasController {
  constructor(private readonly codigoAcessoService: CodigoAcessoService) {}

  @Get(':codigo')
  // Limite mais restrito que o global (60/min): rota pública sem JWT é o alvo
  // mais exposto pra força bruta do código (32 caracteres ^ 5 posições).
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Consulta medidas pelo código de acesso (sem autenticação)' })
  @ApiResponse({ status: 200, description: 'Medidas encontradas.' })
  @ApiResponse({ status: 404, description: 'Código inválido, inativo ou sem medidas.' })
  buscarPorCodigo(@Param('codigo') codigo: string) {
    return this.codigoAcessoService.buscarMedidasPorCodigo(codigo);
  }
}
