#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/data/projetos/medidas-pessoais"
COMPOSE="docker compose -f $APP_DIR/docker-compose.prod.yml --env-file $APP_DIR/.env"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "[1/4] Autenticando no ghcr.io..."
echo "$GHCR_TOKEN" | docker login ghcr.io -u kadukessler --password-stdin

echo "[2/4] Baixando imagens (tag: $IMAGE_TAG)..."
IMAGE_TAG="$IMAGE_TAG" $COMPOSE pull backend frontend

echo "[3/4] Executando migrations..."
IMAGE_TAG="$IMAGE_TAG" $COMPOSE run --rm backend node_modules/.bin/prisma migrate deploy

echo "[4/4] Reiniciando servicos..."
IMAGE_TAG="$IMAGE_TAG" $COMPOSE up -d

echo "Verificando backend..."
BACKEND_PORT=$(grep -E '^BACKEND_PORT=' "$APP_DIR/.env" | cut -d= -f2)
BACKEND_PORT="${BACKEND_PORT:-3000}"

for i in 1 2 3 4 5; do
  if curl -sf "http://localhost:$BACKEND_PORT/health" > /dev/null; then
    echo "Deploy concluido. Backend respondendo na porta $BACKEND_PORT."
    exit 0
  fi
  echo "Tentativa $i/5, aguardando..."
  sleep 5
done

echo "ERRO: backend nao respondeu apos 25 segundos."
exit 1
