import type { ReactNode } from 'react';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <aside className="auth-brand">
        <div className="auth-brand-circle auth-brand-circle-top" />
        <div className="auth-brand-circle auth-brand-circle-bottom" />
        <div className="auth-brand-content">
          <h2>Medidas Pessoais</h2>
          <p>Cadastre suas medidas uma vez e compartilhe com qualquer loja através de um código.</p>
          <ul>
            <li>Suas medidas sempre atualizadas</li>
            <li>Código único de acesso</li>
            <li>Lojas consultam sem perguntar nada a você</li>
          </ul>
        </div>
      </aside>
      {children}
    </div>
  );
}
