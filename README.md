# Medidas Pessoais

Sistema web para registro centralizado de medidas corporais. O consumidor cadastra suas medidas e recebe um código de acesso no formato **MED-XXXXX**. Lojas integradas consultam esse código via API pública para preencher automaticamente campos de tamanho.

## Estrutura

```
medidas-pessoais/
├── frontend/          # React + Vite + TypeScript
├── backend/           # NestJS + Prisma + PostgreSQL
├── docs/              # Diagramas e protótipos
└── docker-compose.yml
```

## Pré-requisitos

- Node.js 22+
- pnpm 10+
- Docker + Docker Compose

## Desenvolvimento local

```bash
# Subir banco de dados
docker compose up -d

# Backend
cd backend
cp .env.example .env
pnpm install
pnpm run start:dev

# Frontend (outro terminal)
cd frontend
cp .env.example .env
pnpm install
pnpm run dev
```

API disponível em `http://localhost:3000`  
Documentação interativa em `http://localhost:3000/reference`  
Frontend em `http://localhost:5173`
