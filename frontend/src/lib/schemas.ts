import { z } from 'zod';

export const registerSchema = z
  .object({
    nome: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Informe a senha'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

const medidaCorporal = z
  .number({ message: 'Informe um número' })
  .positive('Deve ser maior que zero')
  .max(300, 'Valor muito alto');

export const medidasSchema = z.object({
  busto: medidaCorporal,
  torax: medidaCorporal,
  cintura: medidaCorporal,
  quadril: medidaCorporal,
  coxa: medidaCorporal,
  calcado: z
    .number({ message: 'Informe um número' })
    .positive('Deve ser maior que zero')
    .max(50, 'Valor muito alto'),
});

export type MedidasFormData = z.infer<typeof medidasSchema>;
