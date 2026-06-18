// biome-ignore-all lint/style/useImportType: classe injetada via DI do Nest precisa de import de valor (reflect-metadata)
import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let prisma: { usuario: { findUnique: jest.Mock; delete: jest.Mock } };

  const usuarioId = 'usuario-1';

  beforeEach(async () => {
    prisma = { usuario: { findUnique: jest.fn(), delete: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuariosService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(UsuariosService);
  });

  describe('remove', () => {
    it('lança NotFoundException se usuário não existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.remove(usuarioId)).rejects.toThrow(NotFoundException);
      expect(prisma.usuario.delete).not.toHaveBeenCalled();
    });

    it('remove o usuário (cascade cuida de medidas e código)', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: usuarioId });

      await service.remove(usuarioId);

      expect(prisma.usuario.delete).toHaveBeenCalledWith({ where: { id: usuarioId } });
    });
  });
});
