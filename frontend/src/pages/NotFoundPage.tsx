import { Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { PageCard } from '../components/PageCard';
import { isAuthenticated } from '../lib/auth';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageCard title="Página não encontrada" subtitle="Erro 404">
      <div className="empty-state">
        <span className="empty-state-icon">
          <Compass size={28} strokeWidth={2} />
        </span>
        <p className="empty-state-text">Esse endereço não existe ou foi movido.</p>
        <Button onClick={() => navigate(isAuthenticated() ? '/painel' : '/login')}>Voltar</Button>
      </div>
    </PageCard>
  );
}
