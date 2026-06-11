#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/kadukessler/medidas-pessoais.git"
APP_DIR="/data/projetos/medidas-pessoais"

echo "[1/4] Atualizando sistema..."
sudo dnf update -y

echo "[2/4] Instalando Docker..."
if ! command -v docker &>/dev/null; then
  sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
  sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER"
  echo "Reinicie a sessao SSH para o grupo docker ter efeito."
else
  echo "Docker ja instalado."
fi

echo "[3/4] Clonando repositorio..."
if [ -d "$APP_DIR/.git" ]; then
  echo "Repositorio ja existe."
else
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "[4/4] Criando .env..."
if [ ! -f "$APP_DIR/.env" ]; then
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  echo "Edite $APP_DIR/.env com os valores de producao antes do primeiro deploy."
else
  echo ".env ja existe."
fi

echo "Setup concluido."
