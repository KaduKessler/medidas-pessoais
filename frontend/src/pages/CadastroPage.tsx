import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PageCard } from '../components/PageCard';
import { ApiError, api } from '../lib/api';
import { setNome as guardarNome, setToken } from '../lib/auth';
import { registerSchema } from '../lib/schemas';

interface LoginResponse {
  accessToken: string;
  nome: string;
}

export function CadastroPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiErro, setApiErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setApiErro('');

    const resultado = registerSchema.safeParse({ nome, email, senha, confirmarSenha });
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
      await api.post('/auth/register', { nome, email, senha });
      const login = await api.post<LoginResponse>('/auth/login', { email, senha });
      setToken(login.accessToken);
      guardarNome(login.nome);
      navigate('/painel');
    } catch (error) {
      setApiErro(error instanceof ApiError ? error.message : 'Erro ao criar conta');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthLayout>
      <PageCard title="Criar conta" subtitle="Preencha os dados para começar">
        <form onSubmit={handleSubmit}>
          {apiErro && <div className="form-error-banner">{apiErro}</div>}
          <Input
            label="Nome completo"
            name="nome"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            error={errors.nome}
          />
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
            placeholder="Mínimo 8 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            error={errors.senha}
          />
          <Input
            label="Confirmar senha"
            name="confirmarSenha"
            type="password"
            placeholder="Repita a senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            error={errors.confirmarSenha}
          />
          <div style={{ marginTop: 24 }}>
            <Button type="submit" disabled={carregando}>
              {carregando ? 'Criando...' : 'Criar conta'}
            </Button>
          </div>
        </form>
        <p className="form-footer-link">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </PageCard>
    </AuthLayout>
  );
}
