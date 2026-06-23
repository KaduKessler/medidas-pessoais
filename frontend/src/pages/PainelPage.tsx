import { Check, Copy, QrCode, Ruler } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageCard } from '../components/PageCard';
import { Spinner } from '../components/Spinner';
import { ApiError, api } from '../lib/api';
import { clearToken, getNome } from '../lib/auth';
import { MEDIDA_CAMPOS } from '../lib/medidaCampos';

interface Medidas {
  busto: string;
  torax: string;
  cintura: string;
  quadril: string;
  coxa: string;
  calcado: string;
  atualizadoEm: string;
}

interface CodigoAcesso {
  codigo: string;
}

function formatarAtualizacao(data: string): string {
  const hoje = new Date().toDateString();
  const atualizadoEm = new Date(data).toDateString();
  if (hoje === atualizadoEm) return 'Atualizado hoje';
  return `Atualizado em ${new Date(data).toLocaleDateString('pt-BR')}`;
}

function tituloSaudacao(): string {
  const nome = getNome();
  return nome ? `Olá, ${nome.split(' ')[0]}` : 'Minhas Medidas';
}

export function PainelPage() {
  const navigate = useNavigate();
  const [medidas, setMedidas] = useState<Medidas | null>(null);
  const [codigo, setCodigo] = useState<CodigoAcesso | null>(null);
  const [semMedidas, setSemMedidas] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [copiado, setCopiado] = useState(false);
  const [confirmExcluirConta, setConfirmExcluirConta] = useState(false);
  const [excluindoConta, setExcluindoConta] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const dadosMedidas = await api.get<Medidas>('/medidas');
        setMedidas(dadosMedidas);

        try {
          const dadosCodigo = await api.get<CodigoAcesso>('/codigo-acesso');
          setCodigo(dadosCodigo);
        } catch {
          setCodigo(null);
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          setSemMedidas(true);
        }
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function handleCopiar() {
    if (!codigo) return;
    navigator.clipboard.writeText(codigo.codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function handleLogout() {
    clearToken();
    navigate('/login');
  }

  async function handleExcluirConta() {
    setErroExclusao('');
    setExcluindoConta(true);
    try {
      await api.delete('/usuarios/me');
      clearToken();
      navigate('/cadastro');
    } catch (error) {
      setErroExclusao(error instanceof ApiError ? error.message : 'Erro ao excluir conta');
      setConfirmExcluirConta(false);
    } finally {
      setExcluindoConta(false);
    }
  }

  if (carregando) {
    return (
      <PageCard title={tituloSaudacao()} subtitle="Carregando..." onLogout={handleLogout}>
        <Spinner />
      </PageCard>
    );
  }

  if (semMedidas) {
    return (
      <PageCard
        title={tituloSaudacao()}
        subtitle="Você ainda não cadastrou suas medidas"
        onLogout={handleLogout}
      >
        <div className="empty-state">
          <span className="empty-state-icon">
            <Ruler size={28} strokeWidth={2} />
          </span>
          <p className="empty-state-text">
            Cadastre suas medidas pra gerar seu código de acesso único e compartilhar com lojas
            online.
          </p>
          <Button onClick={() => navigate('/medidas/editar')}>Cadastrar medidas</Button>
        </div>
        <div className="danger-zone">
          {erroExclusao && <div className="form-error-banner">{erroExclusao}</div>}
          <button
            type="button"
            className="link-danger"
            onClick={() => setConfirmExcluirConta(true)}
          >
            Excluir minha conta
          </button>
        </div>
        <ConfirmDialog
          open={confirmExcluirConta}
          title="Excluir conta permanentemente?"
          message="Suas medidas e código de acesso serão apagados (LGPD). Essa ação não pode ser desfeita."
          confirmLabel="Excluir conta"
          loading={excluindoConta}
          onConfirm={handleExcluirConta}
          onCancel={() => setConfirmExcluirConta(false)}
        />
      </PageCard>
    );
  }

  return (
    <PageCard
      title={tituloSaudacao()}
      subtitle={medidas ? formatarAtualizacao(medidas.atualizadoEm) : ''}
      onLogout={handleLogout}
    >
      {codigo && (
        // biome-ignore lint/a11y/useSemanticElements: precisa ser div pois contém um <button> real dentro (Copiar). <button> aninhado é HTML inválido
        <div
          className="codigo-panel codigo-panel-clicavel"
          onClick={() => navigate('/codigo-acesso')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') navigate('/codigo-acesso');
          }}
          role="button"
          tabIndex={0}
        >
          <span className="codigo-panel-label">
            <QrCode size={13} strokeWidth={2.5} />
            SEU CÓDIGO DE ACESSO
          </span>
          <div className="codigo-panel-row">
            <span className="codigo-panel-valor">{codigo.codigo}</span>
            <button
              type="button"
              className="codigo-panel-copiar"
              onClick={(e) => {
                e.stopPropagation();
                handleCopiar();
              }}
            >
              {copiado ? (
                <>
                  <Check size={14} strokeWidth={2.5} /> Copiado!
                </>
              ) : (
                <>
                  <Copy size={14} strokeWidth={2.5} /> Copiar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="medidas-grid">
        {medidas &&
          MEDIDA_CAMPOS.map((campo) => (
            <div className="medida-card" key={campo.chave}>
              <span
                className="medida-card-icon"
                style={{ background: `${campo.cor}1a`, color: campo.cor }}
              >
                <campo.icon size={16} strokeWidth={2.5} />
              </span>
              <strong>
                {Number(medidas[campo.chave])}
                {campo.unidade && ` ${campo.unidade}`}
              </strong>
              <span>{campo.labelCurto}</span>
            </div>
          ))}
      </div>

      <Button onClick={() => navigate('/medidas/editar')}>Editar medidas</Button>
      <div className="danger-zone">
        {erroExclusao && <div className="form-error-banner">{erroExclusao}</div>}
        <button type="button" className="link-danger" onClick={() => setConfirmExcluirConta(true)}>
          Excluir minha conta
        </button>
      </div>
      <ConfirmDialog
        open={confirmExcluirConta}
        title="Excluir conta permanentemente?"
        message="Suas medidas e código de acesso serão apagados (LGPD). Essa ação não pode ser desfeita."
        confirmLabel="Excluir conta"
        loading={excluindoConta}
        onConfirm={handleExcluirConta}
        onCancel={() => setConfirmExcluirConta(false)}
      />
    </PageCard>
  );
}
