import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Input } from '../components/Input';
import { PageCard } from '../components/PageCard';
import { Spinner } from '../components/Spinner';
import { ApiError, api } from '../lib/api';
import { clearToken } from '../lib/auth';
import { MEDIDA_CAMPOS } from '../lib/medidaCampos';
import { medidasSchema } from '../lib/schemas';

interface MedidasApi {
  busto: string;
  torax: string;
  cintura: string;
  quadril: string;
  coxa: string;
  calcado: string;
}

const VAZIO = { busto: '', torax: '', cintura: '', quadril: '', coxa: '', calcado: '' };

export function FormularioMedidasPage() {
  const navigate = useNavigate();
  const [valores, setValores] = useState<Record<keyof MedidasApi, string>>(VAZIO);
  const [existe, setExiste] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiErro, setApiErro] = useState('');
  const [confirmExcluir, setConfirmExcluir] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await api.get<MedidasApi>('/medidas');
        setValores({
          busto: dados.busto,
          torax: dados.torax,
          cintura: dados.cintura,
          quadril: dados.quadril,
          coxa: dados.coxa,
          calcado: dados.calcado,
        });
        setExiste(true);
      } catch {
        setExiste(false);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function handleChange(campo: keyof MedidasApi, valor: string) {
    setValores((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setApiErro('');

    const payload = {
      busto: Number(valores.busto),
      torax: Number(valores.torax),
      cintura: Number(valores.cintura),
      quadril: Number(valores.quadril),
      coxa: Number(valores.coxa),
      calcado: Number(valores.calcado),
    };

    const resultado = medidasSchema.safeParse(payload);
    if (!resultado.success) {
      const novosErros: Record<string, string> = {};
      for (const issue of resultado.error.issues) {
        novosErros[issue.path[0] as string] = issue.message;
      }
      setErrors(novosErros);
      return;
    }
    setErrors({});

    setSalvando(true);
    try {
      if (existe) {
        await api.patch('/medidas', payload);
      } else {
        await api.post('/medidas', payload);
      }
      navigate('/painel');
    } catch (error) {
      setApiErro(error instanceof ApiError ? error.message : 'Erro ao salvar medidas');
    } finally {
      setSalvando(false);
    }
  }

  function handleLogout() {
    clearToken();
    navigate('/login');
  }

  async function handleExcluir() {
    setApiErro('');
    setExcluindo(true);
    try {
      await api.delete('/medidas');
      navigate('/painel');
    } catch (error) {
      setApiErro(error instanceof ApiError ? error.message : 'Erro ao excluir medidas');
      setConfirmExcluir(false);
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    return (
      <PageCard title="Editar Medidas" subtitle="Carregando..." onLogout={handleLogout}>
        <Spinner />
      </PageCard>
    );
  }

  return (
    <PageCard
      title={existe ? 'Editar Medidas' : 'Cadastrar Medidas'}
      subtitle={existe ? 'Atualize seus dados corporais' : 'Informe seus dados corporais'}
      onLogout={handleLogout}
    >
      <form onSubmit={handleSubmit}>
        {apiErro && <div className="form-error-banner">{apiErro}</div>}
        <div className="medidas-form-grid">
          {MEDIDA_CAMPOS.map((campo) => (
            <Input
              key={campo.chave}
              label={campo.label}
              icon={campo.icon}
              iconColor={campo.cor}
              name={campo.chave}
              type="number"
              step="0.1"
              inputMode="decimal"
              value={valores[campo.chave]}
              onChange={(e) => handleChange(campo.chave, e.target.value)}
              error={errors[campo.chave]}
            />
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <Button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar medidas'}
          </Button>
        </div>
        <div style={{ marginTop: 12 }}>
          <Button type="button" variant="outline" onClick={() => navigate('/painel')}>
            Cancelar
          </Button>
        </div>
        {existe && (
          <div className="danger-zone">
            <Button type="button" variant="danger" onClick={() => setConfirmExcluir(true)}>
              Excluir medidas
            </Button>
          </div>
        )}
      </form>
      <ConfirmDialog
        open={confirmExcluir}
        title="Excluir medidas?"
        message="Seu código de acesso será desativado e as lojas deixarão de conseguir consultar seus dados."
        confirmLabel="Excluir"
        loading={excluindo}
        onConfirm={handleExcluir}
        onCancel={() => setConfirmExcluir(false)}
      />
    </PageCard>
  );
}
