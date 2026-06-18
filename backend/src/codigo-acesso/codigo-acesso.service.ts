// biome-ignore-all lint/style/useImportType: classe injetada via DI do Nest precisa de import de valor (reflect-metadata)
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem 0, O, 1, I (ambiguidade visual)
const TAMANHO_CODIGO = 5;
const TENTATIVAS_MAXIMAS = 5;

@Injectable()
export class CodigoAcessoService {
  constructor(private readonly prisma: PrismaService) {}

  private gerarCodigoAleatorio(): string {
    let sufixo = '';
    for (let i = 0; i < TAMANHO_CODIGO; i++) {
      sufixo += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
    }
    return `MED-${sufixo}`;
  }

  private async gerarCodigoUnico(): Promise<string> {
    for (let tentativa = 0; tentativa < TENTATIVAS_MAXIMAS; tentativa++) {
      const codigo = this.gerarCodigoAleatorio();
      const existente = await this.prisma.codigoAcesso.findUnique({ where: { codigo } });
      if (!existente) return codigo;
    }
    throw new Error('Não foi possível gerar um código único após várias tentativas');
  }

  async gerarOuReativarParaUsuario(usuarioId: string) {
    const existente = await this.prisma.codigoAcesso.findUnique({ where: { usuarioId } });
    if (existente) {
      return this.prisma.codigoAcesso.update({
        where: { usuarioId },
        data: { ativo: true },
      });
    }

    const codigo = await this.gerarCodigoUnico();
    return this.prisma.codigoAcesso.create({ data: { usuarioId, codigo } });
  }

  async desativarParaUsuario(usuarioId: string) {
    await this.prisma.codigoAcesso.updateMany({ where: { usuarioId }, data: { ativo: false } });
  }

  async buscarPorUsuario(usuarioId: string) {
    const codigoAcesso = await this.prisma.codigoAcesso.findUnique({ where: { usuarioId } });
    if (!codigoAcesso) throw new NotFoundException('Código de acesso não encontrado');

    return codigoAcesso;
  }

  async buscarMedidasPorCodigo(codigo: string) {
    const codigoAcesso = await this.prisma.codigoAcesso.findUnique({ where: { codigo } });
    if (!codigoAcesso?.ativo) {
      throw new NotFoundException('Código de acesso inválido ou inativo');
    }

    const medidas = await this.prisma.medidas.findUnique({
      where: { usuarioId: codigoAcesso.usuarioId },
    });
    if (!medidas) throw new NotFoundException('Medidas não encontradas para este código');

    const { id, usuarioId, criadoEm, atualizadoEm, ...dadosPublicos } = medidas;
    return dadosPublicos;
  }
}
