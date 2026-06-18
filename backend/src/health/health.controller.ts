// biome-ignore-all lint/style/useImportType: classes injetadas via DI do Nest precisam de import de valor (reflect-metadata)
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HealthIndicatorService } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly indicators: HealthIndicatorService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Verifica saúde da aplicação',
    description: 'Checa se a API está respondendo e se a conexão com o banco de dados está ativa.',
  })
  @ApiResponse({ status: 200, description: 'Aplicação e banco de dados funcionando.' })
  @ApiResponse({ status: 503, description: 'Banco de dados inacessível.' })
  check() {
    return this.health.check([
      async () => {
        const indicator = this.indicators.check('database');
        try {
          await this.prisma.$queryRaw`SELECT 1`;
          return indicator.up();
        } catch (error) {
          return indicator.down({
            message: error instanceof Error ? error.message : 'unknown error',
          });
        }
      },
    ]);
  }
}
