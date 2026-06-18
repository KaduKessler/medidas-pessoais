// biome-ignore-all lint/style/useImportType: classe injetada via DI do Nest precisa de import de valor (reflect-metadata)
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CodigoAcessoService } from '../codigo-acesso/codigo-acesso.service';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateMedidasDto } from './dto/create-medidas.dto';
import type { UpdateMedidasDto } from './dto/update-medidas.dto';

@Injectable()
export class MedidasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly codigoAcessoService: CodigoAcessoService,
  ) {}

  async create(usuarioId: string, dto: CreateMedidasDto) {
    const existente = await this.prisma.medidas.findUnique({ where: { usuarioId } });
    if (existente) throw new ConflictException('Medidas já cadastradas para este usuário');

    const medidas = await this.prisma.medidas.create({ data: { usuarioId, ...dto } });
    await this.codigoAcessoService.gerarOuReativarParaUsuario(usuarioId);

    return medidas;
  }

  async findOne(usuarioId: string) {
    const medidas = await this.prisma.medidas.findUnique({ where: { usuarioId } });
    if (!medidas) throw new NotFoundException('Medidas não encontradas');

    return medidas;
  }

  async update(usuarioId: string, dto: UpdateMedidasDto) {
    await this.findOne(usuarioId);

    return this.prisma.medidas.update({ where: { usuarioId }, data: dto });
  }

  async remove(usuarioId: string) {
    await this.findOne(usuarioId);

    await this.prisma.medidas.delete({ where: { usuarioId } });
    await this.codigoAcessoService.desativarParaUsuario(usuarioId);
  }
}
