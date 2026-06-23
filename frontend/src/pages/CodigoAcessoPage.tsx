import { Check, Copy, QrCode, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { PageCard } from '../components/PageCard';
import { Spinner } from '../components/Spinner';
import { api } from '../lib/api';
import { clearToken } from '../lib/auth';

interface CodigoAcesso {
  codigo: string;
}

export function CodigoAcessoPage() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState<CodigoAcesso | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get<CodigoAcesso>('/codigo-acesso')
      .then(setCodigo)
      .finally(() => setCarregando(false));
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

  if (carregando) {
    return (
      <PageCard title="Código de Acesso" subtitle="Carregando..." onLogout={handleLogout}>
        <Spinner />
      </PageCard>
    );
  }

  return (
    <PageCard
      title="Código de Acesso"
      subtitle="Compartilhe com lojas online"
      onLogout={handleLogout}
    >
      <div className="codigo-destaque">
        <span className="codigo-destaque-icone">
          <QrCode size={28} strokeWidth={2} />
        </span>
        <span className="codigo-destaque-label">SEU CÓDIGO ÚNICO</span>
        <strong className="codigo-destaque-valor">{codigo?.codigo}</strong>
        <button type="button" className="codigo-destaque-botao" onClick={handleCopiar}>
          <Copy size={15} strokeWidth={2.5} /> Copiar código
        </button>
        {copiado && (
          <span className="codigo-destaque-badge">
            <Check size={14} strokeWidth={2.5} /> Copiado!
          </span>
        )}
      </div>
      <p className="codigo-instrucao">
        Informe este código na loja online para que suas medidas sejam preenchidas automaticamente.
      </p>
      <Button onClick={() => navigate('/painel')}>Ver minhas medidas</Button>
      <div className="danger-zone">
        <button type="button" className="link-loja" onClick={() => navigate('/loja')}>
          <Store size={13} strokeWidth={2.5} /> Ver como uma loja consulta esse código
        </button>
      </div>
    </PageCard>
  );
}
