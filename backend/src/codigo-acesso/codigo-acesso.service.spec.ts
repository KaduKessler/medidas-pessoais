// biome-ignore-all lint/style/useImportType: classe injetada via DI do Nest precisa de import de valor (reflect-metadata)
import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CodigoAcessoService } from './codigo-acesso.service';

describe('CodigoAcessoService', () => {
  let service: CodigoAcessoService;
  let prisma: {
    codigoAcesso: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
    medidas: { findUnique: jest.Mock };
  };

  const usuarioId = 'usuario-1';

  beforeEach(async () => {
    prisma = {
      codigoAcesso: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      medidas: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CodigoAcessoService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(CodigoAcessoService);
  });

  describe('gerarOuReativarParaUsuario', () => {
    it('gera código novo no formato MED-XXXXX se usuário não tem nenhum', async () => {
      prisma.codigoAcesso.findUnique.mockResolvedValueOnce(null); // busca por usuarioId
      prisma.codigoAcesso.findUnique.mockResolvedValueOnce(null); // checagem de unicidade
      prisma.codigoAcesso.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: '1', ativo: true, ...data }),
      );

      const result = await service.gerarOuReativarParaUsuario(usuarioId);

      expect(result.codigo).toMatch(/^MED-[A-Z2-9]{5}$/);
      expect(result.codigo).not.toMatch(/[01OI]/);
      expect(prisma.codigoAcesso.create).toHaveBeenCalled();
    });

    it('reativa código existente em vez de gerar um novo', async () => {
      prisma.codigoAcesso.findUnique.mockResolvedValue({
        id: '1',
        usuarioId,
        codigo: 'MED-ABCDE',
        ativo: false,
      });
      prisma.codigoAcesso.update.mockResolvedValue({
        id: '1',
        usuarioId,
        codigo: 'MED-ABCDE',
        ativo: true,
      });

      const result = await service.gerarOuReativarParaUsuario(usuarioId);

      expect(prisma.codigoAcesso.create).not.toHaveBeenCalled();
      expect(prisma.codigoAcesso.update).toHaveBeenCalledWith({
        where: { usuarioId },
        data: { ativo: true },
      });
      expect(result.ativo).toBe(true);
    });
  });

  describe('desativarParaUsuario', () => {
    it('desativa o código do usuário', async () => {
      await service.desativarParaUsuario(usuarioId);

      expect(prisma.codigoAcesso.updateMany).toHaveBeenCalledWith({
        where: { usuarioId },
        data: { ativo: false },
      });
    });
  });

  describe('buscarPorUsuario', () => {
    it('lança NotFoundException se usuário não tem código', async () => {
      prisma.codigoAcesso.findUnique.mockResolvedValue(null);

      await expect(service.buscarPorUsuario(usuarioId)).rejects.toThrow(NotFoundException);
    });

    it('retorna o código do usuário', async () => {
      prisma.codigoAcesso.findUnique.mockResolvedValue({
        id: '1',
        usuarioId,
        codigo: 'MED-ABCDE',
        ativo: true,
      });

      const result = await service.buscarPorUsuario(usuarioId);

      expect(result.codigo).toBe('MED-ABCDE');
    });
  });

  describe('buscarMedidasPorCodigo', () => {
    it('lança NotFoundException se código não existe', async () => {
      prisma.codigoAcesso.findUnique.mockResolvedValue(null);

      await expect(service.buscarMedidasPorCodigo('MED-ZZZZZ')).rejects.toThrow(NotFoundException);
    });

    it('lança NotFoundException se código está inativo', async () => {
      prisma.codigoAcesso.findUnique.mockResolvedValue({
        usuarioId,
        codigo: 'MED-ABCDE',
        ativo: false,
      });

      await expect(service.buscarMedidasPorCodigo('MED-ABCDE')).rejects.toThrow(NotFoundException);
    });

    it('retorna medidas sem dados internos (id, usuarioId, timestamps)', async () => {
      prisma.codigoAcesso.findUnique.mockResolvedValue({
        usuarioId,
        codigo: 'MED-ABCDE',
        ativo: true,
      });
      prisma.medidas.findUnique.mockResolvedValue({
        id: 'm1',
        usuarioId,
        busto: 90,
        torax: 85,
        cintura: 70,
        quadril: 95,
        coxa: 55,
        calcado: 38,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      const result = await service.buscarMedidasPorCodigo('MED-ABCDE');

      expect(result).toEqual({
        busto: 90,
        torax: 85,
        cintura: 70,
        quadril: 95,
        coxa: 55,
        calcado: 38,
      });
    });
  });
});
