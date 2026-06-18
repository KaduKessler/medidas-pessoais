// biome-ignore-all lint/style/useImportType: DTO precisa de import de valor, ValidationPipe transforma @Body() na classe via reflect-metadata
import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type AuthenticatedUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMedidasDto } from './dto/create-medidas.dto';
import { UpdateMedidasDto } from './dto/update-medidas.dto';
import { MedidasService } from './medidas.service';

@ApiTags('medidas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medidas')
export class MedidasController {
  constructor(private readonly medidasService: MedidasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra as medidas do usuário autenticado' })
  @ApiResponse({ status: 201, description: 'Medidas cadastradas.' })
  @ApiResponse({ status: 409, description: 'Medidas já cadastradas para este usuário.' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateMedidasDto) {
    return this.medidasService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Consulta as medidas do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Medidas encontradas.' })
  @ApiResponse({ status: 404, description: 'Medidas não encontradas.' })
  findOne(@CurrentUser() user: AuthenticatedUser) {
    return this.medidasService.findOne(user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Atualiza as medidas do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Medidas atualizadas.' })
  @ApiResponse({ status: 404, description: 'Medidas não encontradas.' })
  update(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateMedidasDto) {
    return this.medidasService.update(user.id, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove as medidas do usuário autenticado e desativa o código' })
  @ApiResponse({ status: 200, description: 'Medidas removidas.' })
  @ApiResponse({ status: 404, description: 'Medidas não encontradas.' })
  remove(@CurrentUser() user: AuthenticatedUser) {
    return this.medidasService.remove(user.id);
  }
}
