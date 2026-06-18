// biome-ignore-all lint/style/useImportType: classe injetada via DI do Nest precisa de import de valor (reflect-metadata)
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async remove(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    // CASCADE no schema remove Medidas e CodigoAcesso junto (LGPD: exclusão permanente)
    await this.prisma.usuario.delete({ where: { id: usuarioId } });
  }
}
