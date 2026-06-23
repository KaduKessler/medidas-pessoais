import { LogOut } from 'lucide-react';
import type { ReactNode } from 'react';
import './PageCard.css';

interface PageCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  onLogout?: () => void;
}

export function PageCard({ title, subtitle, children, onLogout }: PageCardProps) {
  return (
    <div className="page-card">
      <header className="page-card-header">
        <div className="page-card-header-circle page-card-header-circle-top" />
        <div className="page-card-header-circle page-card-header-circle-bottom" />
        {onLogout && (
          <button type="button" className="page-card-logout" onClick={onLogout} title="Sair">
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        )}
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      <div className="page-card-body">{children}</div>
    </div>
  );
}
