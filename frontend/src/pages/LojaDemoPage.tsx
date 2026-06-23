import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  LoaderCircle,
  PackageSearch,
  Search,
  Shirt,
  ShoppingCart,
  Store,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/Spinner.css';
import { ApiError, api } from '../lib/api';
import { MEDIDA_CAMPOS } from '../lib/medidaCampos';
import './LojaDemoPage.css';

interface MedidasPublicas {
  busto: string;
  torax: string;
  cintura: string;
  quadril: string;
  coxa: string;
  calcado: string;
}

type Tamanho = 'P' | 'M' | 'G' | 'GG';
const TAMANHOS: Tamanho[] = ['P', 'M', 'G', 'GG'];

function recomendarTamanho(torax: number): Tamanho {
  if (torax <= 86) return 'P';
  if (torax <= 94) return 'M';
  if (torax <= 102) return 'G';
  return 'GG';
}

export function LojaDemoPage() {
  const [codigo, setCodigo] = useState('');
  const [medidas, setMedidas] = useState<MedidasPublicas | null>(null);
  const [tamanho, setTamanho] = useState<Tamanho | null>(null);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [naSacola, setNaSacola] = useState(false);

  async function handleBuscar(event: FormEvent) {
    event.preventDefault();
    if (!codigo.trim()) {
      setErro('Digite um código pra buscar');
      return;
    }

    setErro('');
    setMedidas(null);
    setTamanho(null);
    setNaSacola(false);
    setBuscando(true);
    try {
      const dados = await api.get<MedidasPublicas>(
        `/api/medidas/${encodeURIComponent(codigo.trim().toUpperCase())}`,
      );
      setMedidas(dados);
      setTamanho(recomendarTamanho(Number(dados.torax)));
    } catch (error) {
      setErro(
        error instanceof ApiError && error.status === 404
          ? 'Código não encontrado ou inativo'
          : 'Erro ao consultar código',
      );
    } finally {
      setBuscando(false);
    }
  }

  const recomendado = medidas ? recomendarTamanho(Number(medidas.torax)) : null;

  return (
    <div className="loja-page">
      <span className="loja-badge">
        <Store size={14} strokeWidth={2.5} /> SIMULAÇÃO · LOJA PARCEIRA
      </span>
      <div className="loja-card">
        <div className="loja-browser-bar">
          <span className="loja-dot loja-dot-red" />
          <span className="loja-dot loja-dot-yellow" />
          <span className="loja-dot loja-dot-green" />
          <span className="loja-browser-url">lojaparceira.com.br/produto/camiseta-pucrs</span>
        </div>
        <div className="loja-card-body">
          <h1>Consultar medidas do cliente</h1>
          <p className="loja-subtitulo">
            Sua loja digita o código de acesso que o cliente informou na hora da compra, sem
            precisar perguntar nenhuma medida.
          </p>
          <form className="loja-form" onSubmit={handleBuscar}>
            <input
              className="loja-input"
              placeholder="MED-XXXXX"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              disabled={buscando}
            />
            <button type="submit" className="loja-botao" disabled={buscando}>
              {buscando ? (
                <LoaderCircle size={16} strokeWidth={2.5} className="spinner-icon" />
              ) : (
                <Search size={16} strokeWidth={2.5} />
              )}
              {buscando ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {erro && (
            <div className="loja-erro">
              <CircleX size={16} strokeWidth={2.5} /> {erro}
            </div>
          )}

          {!medidas && !erro && (
            <div className="loja-placeholder">
              <span className="loja-placeholder-icon">
                <PackageSearch size={24} strokeWidth={1.5} />
              </span>
              <p>Aguardando código do cliente para mostrar o produto e o tamanho recomendado.</p>
            </div>
          )}

          {medidas && tamanho && (
            <div className="loja-produto">
              <div className="loja-produto-imagem">
                <Shirt size={40} strokeWidth={1.5} />
              </div>
              <div className="loja-produto-info">
                <h2>Camiseta Oficial PUCRS</h2>
                <span className="loja-produto-preco">R$ 89,90</span>

                <span className="loja-tamanho-label">Tamanho</span>
                <div className="loja-tamanhos">
                  {TAMANHOS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`loja-tamanho${t === tamanho ? ' loja-tamanho-ativo' : ''}`}
                      aria-pressed={t === tamanho}
                      onClick={() => setTamanho(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {tamanho === recomendado && (
                  <span className="loja-recomendado">
                    <BadgeCheck size={14} strokeWidth={2.5} /> Recomendado com base nas suas medidas
                  </span>
                )}

                <button
                  type="button"
                  className="loja-sacola"
                  onClick={() => setNaSacola(true)}
                  disabled={naSacola}
                >
                  <ShoppingCart size={16} strokeWidth={2.5} />
                  {naSacola ? 'Adicionado à sacola!' : 'Adicionar à sacola'}
                </button>
              </div>
            </div>
          )}

          {medidas && (
            <details className="loja-detalhe">
              <summary>
                <CircleCheck size={15} strokeWidth={2.5} /> Medidas usadas na recomendação
              </summary>
              <div className="loja-resultado-grid">
                {MEDIDA_CAMPOS.map((campo) => (
                  <label className="loja-campo" key={campo.chave}>
                    <span>{campo.label}</span>
                    <input
                      value={`${medidas[campo.chave]}${campo.unidade ? ` ${campo.unidade}` : ''}`}
                      readOnly
                    />
                  </label>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
      <Link className="loja-voltar" to="/">
        Voltar ao app
      </Link>
    </div>
  );
}
