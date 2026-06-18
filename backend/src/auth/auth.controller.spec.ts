// biome-ignore-all lint/style/useImportType: classe injetada via DI do Nest precisa de import de valor (reflect-metadata)
import { Test, type TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { register: jest.Mock; login: jest.Mock };

  beforeEach(async () => {
    authService = { register: jest.fn(), login: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get(AuthController);
  });

  it('register delega pro AuthService com o DTO recebido', async () => {
    const dto = { nome: 'Teste', email: 'teste@medidas.com', senha: 'senha12345' };
    authService.register.mockResolvedValue({ id: '1', nome: dto.nome, email: dto.email });

    const result = await controller.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: '1', nome: dto.nome, email: dto.email });
  });

  it('login delega pro AuthService com o DTO recebido', async () => {
    const dto = { email: 'teste@medidas.com', senha: 'senha12345' };
    authService.login.mockResolvedValue({ accessToken: 'token-fake' });

    const result = await controller.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ accessToken: 'token-fake' });
  });
});
