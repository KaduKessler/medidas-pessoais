// biome-ignore-all lint/style/useImportType: classe injetada via DI do Nest precisa de import de valor (reflect-metadata)
import { Controller, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type AuthenticatedUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsuariosService } from './usuarios.service';

@ApiTags('usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Delete('me')
  @ApiOperation({
    summary: 'Exclui permanentemente a conta do usuário autenticado',
    description: 'Remove usuário, medidas e código de acesso (LGPD). Ação irreversível.',
  })
  @ApiResponse({ status: 200, description: 'Conta excluída.' })
  remove(@CurrentUser() user: AuthenticatedUser) {
    return this.usuariosService.remove(user.id);
  }
}
