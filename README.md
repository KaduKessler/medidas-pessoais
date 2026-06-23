# Medidas Pessoais

![CI](https://github.com/kadukessler/medidas-pessoais/actions/workflows/ci.yml/badge.svg)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

## Sobre

Sistema web para registro centralizado de medidas corporais. O consumidor cadastra suas medidas uma única vez e recebe um código de acesso no formato **MED-XXXXX**. Lojas integradas consultam esse código via API pública para preencher automaticamente campos de tamanho - sem que o consumidor precise informar suas medidas em cada loja.

**Aplicação:** <https://medidas.kadukessler.com> ⚠️ WIP  
**Documentação da API:** <https://api-medidas.kadukessler.com/reference> ⚠️ WIP  
**Status dos serviços:** <https://status.kadukessler.com/status/medidas-pessoais>

> Desenvolvido para as disciplinas **DevOps na Prática** e **Disciplina Integradora de Desenvolvimento de Projetos** da [PUCRS](https://www.pucrs.br).

## Funcionalidades

- **Conta:** cadastro, login (JWT), exclusão de conta com remoção permanente de todos os dados (LGPD)
- **Medidas:** cadastro, edição e exclusão de busto, tórax, cintura, quadril, coxa e calçado
- **Código de acesso:** gerado automaticamente ao cadastrar a primeira medida, reativado (não recriado) se as medidas forem excluídas e cadastradas de novo
- **API pública:** lojas consultam o código sem autenticação para preencher tamanhos automaticamente
- **Simulação de loja parceira** (`/loja`): demonstra esse fluxo na prática. Digite um código gerado no app e veja um produto de exemplo com o tamanho já recomendado a partir das medidas do cliente

## Telas (frontend)

| Rota | Descrição |
|---|---|
| `/cadastro` | Criar conta |
| `/login` | Entrar |
| `/painel` | Medidas, código de acesso, editar/excluir |
| `/medidas/editar` | Cadastrar ou editar medidas |
| `/codigo-acesso` | Código em destaque, copiar, link pra simulação de loja |
| `/loja` | Simulação de loja parceira consumindo a API pública (rota pública, sem login) |

## Stack

**Backend:** NestJS · Prisma · PostgreSQL · JWT · Passport · Swagger + Scalar  
**Frontend:** React · Vite · TypeScript · Zod  
**Infra:** Docker · GitHub Actions · Oracle Cloud ARM

## Endpoints principais ⚠️ WIP

| Método | Rota | Auth |
|---|---|---|
| POST | /auth/register | - |
| POST | /auth/login | - |
| GET | /medidas | JWT |
| POST | /medidas | JWT |
| PATCH | /medidas | JWT |
| DELETE | /medidas | JWT |
| GET | /codigo-acesso | JWT |
| GET | /api/medidas/:codigo | - |
| DELETE | /usuarios/me | JWT |
| GET | /health | - |

## Estrutura

```
medidas-pessoais/
├── .github/workflows/     # CI/CD (GitHub Actions)
├── backend/               # NestJS + Prisma + PostgreSQL
├── docs/                  # Diagramas e protótipos
├── frontend/              # React + Vite + TypeScript
├── infra/                 # Scripts de setup e deploy do servidor
├── docker-compose.yml     # Desenvolvimento local (só PostgreSQL)
└── docker-compose.prod.yml
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

## Variáveis de ambiente

### Backend (`backend/.env`)

| Variável | Descrição | Obrigatória |
|---|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL | ✅ |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT | ✅ |
| `JWT_EXPIRES_IN` | Expiração do token (ex: `7d`) | ✅ |
| `PORT` | Porta do servidor (padrão: `3000`) | - |

### Frontend (`frontend/.env`)

| Variável | Descrição | Obrigatória |
|---|---|---|
| `VITE_API_URL` | URL base da API (ex: `http://localhost:3000`) | ✅ |

## Deploy

O deploy é feito automaticamente via GitHub Actions a cada push na `main`:

1. Lint + Typecheck
2. Testes
3. Build das imagens Docker (ARM64) e push para `ghcr.io`
4. SSH no servidor → pull das imagens → migrations → restart dos containers

### Setup inicial do servidor

```bash
bash infra/setup.sh
# Edite o .env no servidor com os valores de produção
```

### Secrets necessários no GitHub

| Secret | Descrição |
|---|---|
| `DEPLOY_KEY` | Chave SSH privada para acesso ao servidor |
| `DEPLOY_HOST` | IP ou hostname do servidor |
| `VITE_API_URL` | URL pública da API |
