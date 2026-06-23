import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PageCard } from '../components/PageCard';
import { ApiError, api } from '../lib/api';
import { setNome, setToken } from '../lib/auth';
import { loginSchema } from '../lib/schemas';

interface LoginResponse {
  accessToken: string;
  nome: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiErro, setApiErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setApiErro('');

    const resultado = loginSchema.safeParse({ email, senha });
    if (!resultado.success) {
      const novosErros: Record<string, string> = {};
      for (const issue of resultado.error.issues) {
        novosErros[issue.path[0] as string] = issue.message;
      }
      setErrors(novosErros);
      return;
    }
    setErrors({});

    setCarregando(true);
    try {
      const { accessToken, nome } = await api.post<LoginResponse>('/auth/login', {
        email,
        senha,
      });
      setToken(accessToken);
      setNome(nome);
      navigate('/painel');
    } catch (error) {
      setApiErro(error instanceof ApiError ? error.message : 'Erro ao entrar');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthLayout>
      <PageCard title="Bem-vindo de volta" subtitle="Acesse sua conta">
        <form onSubmit={handleSubmit}>
          {apiErro && <div className="form-error-banner">{apiErro}</div>}
          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input
            label="Senha"
            name="senha"
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            error={errors.senha}
          />
          <Button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>
          <div style={{ marginTop: 12 }}>
            <Button type="button" variant="outline" onClick={() => navigate('/cadastro')}>
              Criar conta
            </Button>
          </div>
        </form>
      </PageCard>
    </AuthLayout>
  );
}
