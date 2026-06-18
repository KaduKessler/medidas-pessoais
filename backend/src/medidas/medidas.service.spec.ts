// biome-ignore-all lint/style/useImportType: classe injetada via DI do Nest precisa de import de valor (reflect-metadata)
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { CodigoAcessoService } from '../codigo-acesso/codigo-acesso.service';
import { PrismaService } from '../prisma/prisma.service';
import { MedidasService } from './medidas.service';

describe('MedidasService', () => {
  let service: MedidasService;
  let prisma: {
    medidas: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock };
  };
  let codigoAcessoService: {
    gerarOuReativarParaUsuario: jest.Mock;
    desativarParaUsuario: jest.Mock;
  };

  const usuarioId = 'usuario-1';
  const dto = { busto: 90.5, torax: 85, cintura: 70, quadril: 95, coxa: 55, calcado: 38 };

  beforeEach(async () => {
    prisma = {
      medidas: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    codigoAcessoService = {
      gerarOuReativarParaUsuario: jest.fn(),
      desativarParaUsuario: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedidasService,
        { provide: PrismaService, useValue: prisma },
        { provide: CodigoAcessoService, useValue: codigoAcessoService },
      ],
    }).compile();

    service = module.get(MedidasService);
  });

  describe('create', () => {
    it('lança ConflictException se já existem medidas pro usuário', async () => {
      prisma.medidas.findUnique.mockResolvedValue({ id: '1' });

      await expect(service.create(usuarioId, dto)).rejects.toThrow(ConflictException);
      expect(prisma.medidas.create).not.toHaveBeenCalled();
    });

    it('cria medidas vinculadas ao usuário', async () => {
      prisma.medidas.findUnique.mockResolvedValue(null);
      prisma.medidas.create.mockResolvedValue({ id: '1', usuarioId, ...dto });

      const result = await service.create(usuarioId, dto);

      expect(prisma.medidas.create).toHaveBeenCalledWith({ data: { usuarioId, ...dto } });
      expect(codigoAcessoService.gerarOuReativarParaUsuario).toHaveBeenCalledWith(usuarioId);
      expect(result).toEqual({ id: '1', usuarioId, ...dto });
    });
  });

  describe('findOne', () => {
    it('lança NotFoundException se não existem medidas', async () => {
      prisma.medidas.findUnique.mockResolvedValue(null);

      await expect(service.findOne(usuarioId)).rejects.toThrow(NotFoundException);
    });

    it('retorna as medidas do usuário', async () => {
      prisma.medidas.findUnique.mockResolvedValue({ id: '1', usuarioId, ...dto });

      const result = await service.findOne(usuarioId);

      expect(result).toEqual({ id: '1', usuarioId, ...dto });
    });
  });

  describe('update', () => {
    it('lança NotFoundException se não existem medidas', async () => {
      prisma.medidas.findUnique.mockResolvedValue(null);

      await expect(service.update(usuarioId, { busto: 91 })).rejects.toThrow(NotFoundException);
      expect(prisma.medidas.update).not.toHaveBeenCalled();
    });

    it('atualiza parcialmente as medidas existentes', async () => {
      prisma.medidas.findUnique.mockResolvedValue({ id: '1', usuarioId, ...dto });
      prisma.medidas.update.mockResolvedValue({ id: '1', usuarioId, ...dto, busto: 91 });

      const result = await service.update(usuarioId, { busto: 91 });

      expect(prisma.medidas.update).toHaveBeenCalledWith({
        where: { usuarioId },
        data: { busto: 91 },
      });
      expect(result.busto).toBe(91);
    });
  });

  describe('remove', () => {
    it('lança NotFoundException se não existem medidas', async () => {
      prisma.medidas.findUnique.mockResolvedValue(null);

      await expect(service.remove(usuarioId)).rejects.toThrow(NotFoundException);
      expect(prisma.medidas.delete).not.toHaveBeenCalled();
    });

    it('remove as medidas e desativa o código de acesso', async () => {
      prisma.medidas.findUnique.mockResolvedValue({ id: '1', usuarioId, ...dto });

      await service.remove(usuarioId);

      expect(prisma.medidas.delete).toHaveBeenCalledWith({ where: { usuarioId } });
      expect(codigoAcessoService.desativarParaUsuario).toHaveBeenCalledWith(usuarioId);
    });
  });
});
