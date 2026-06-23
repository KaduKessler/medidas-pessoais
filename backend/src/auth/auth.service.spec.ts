// biome-ignore-all lint/style/useImportType: classes injetadas via DI do Nest precisam de import de valor (reflect-metadata)
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { usuario: { findUnique: jest.Mock; create: jest.Mock } };
  let jwt: { signAsync: jest.Mock };

  beforeEach(async () => {
    prisma = { usuario: { findUnique: jest.fn(), create: jest.fn() } };
    jwt = { signAsync: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('register', () => {
    it('lança ConflictException se o e-mail já existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: '1' });

      await expect(
        service.register({ nome: 'Teste', email: 'teste@medidas.com', senha: 'senha12345' }),
      ).rejects.toThrow(ConflictException);

      expect(prisma.usuario.create).not.toHaveBeenCalled();
    });

    it('cria usuário com senha hasheada e retorna sem o hash', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);
      prisma.usuario.create.mockImplementation(({ data }) => Promise.resolve({ id: '1', ...data }));

      const result = await service.register({
        nome: 'Teste',
        email: 'teste@medidas.com',
        senha: 'senha12345',
      });

      expect(result).toEqual({ id: '1', nome: 'Teste', email: 'teste@medidas.com' });
      expect(result).not.toHaveProperty('senhaHash');

      const senhaHash = prisma.usuario.create.mock.calls[0][0].data.senhaHash;
      expect(senhaHash).not.toBe('senha12345');
      expect(await bcrypt.compare('senha12345', senhaHash)).toBe(true);
    });
  });

  describe('login', () => {
    it('lança UnauthorizedException se o usuário não existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'naoexiste@medidas.com', senha: 'qualquer' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('lança UnauthorizedException se a senha está errada', async () => {
      const senhaHash = await bcrypt.hash('senhacerta', 10);
      prisma.usuario.findUnique.mockResolvedValue({
        id: '1',
        nome: 'Teste',
        email: 'a@a.com',
        senhaHash,
      });

      await expect(service.login({ email: 'a@a.com', senha: 'senhaerrada' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('retorna accessToken e nome quando a senha está correta', async () => {
      const senhaHash = await bcrypt.hash('senhacerta', 10);
      prisma.usuario.findUnique.mockResolvedValue({
        id: '1',
        nome: 'Teste',
        email: 'a@a.com',
        senhaHash,
      });
      jwt.signAsync.mockResolvedValue('token-fake');

      const result = await service.login({ email: 'a@a.com', senha: 'senhacerta' });

      expect(result).toEqual({ accessToken: 'token-fake', nome: 'Teste' });
      expect(jwt.signAsync).toHaveBeenCalledWith({ sub: '1', email: 'a@a.com' });
    });
  });
});
