// biome-ignore-all lint/style/useImportType: classe injetada via DI do Nest precisa de import de valor (reflect-metadata)
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type AuthenticatedUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CodigoAcessoService } from './codigo-acesso.service';

@ApiTags('codigo-acesso')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('codigo-acesso')
export class CodigoAcessoController {
  constructor(private readonly codigoAcessoService: CodigoAcessoService) {}

  @Get()
  @ApiOperation({ summary: 'Consulta o código de acesso do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Código encontrado.' })
  @ApiResponse({ status: 404, description: 'Código não encontrado (nenhuma medida cadastrada).' })
  buscarPorUsuario(@CurrentUser() user: AuthenticatedUser) {
    return this.codigoAcessoService.buscarPorUsuario(user.id);
  }
}
