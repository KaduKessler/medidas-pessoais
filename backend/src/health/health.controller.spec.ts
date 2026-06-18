import { ServiceUnavailableException } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { Test, type TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    controller = module.get(HealthController);
  });

  it('retorna status ok quando o banco responde', async () => {
    prisma.$queryRaw.mockResolvedValue([{ 1: 1 }]);

    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.details.database.status).toBe('up');
  });

  it('lança 503 com status error quando o banco falha', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

    await expect(controller.check()).rejects.toThrow(ServiceUnavailableException);

    try {
      await controller.check();
    } catch (error) {
      const response = (error as ServiceUnavailableException).getResponse() as {
        status: string;
        details: { database: { status: string } };
      };
      expect(response.status).toBe('error');
      expect(response.details.database.status).toBe('down');
    }
  });
});
