#!/usr/bin/env bash
set -e
SERVER="${1:-http://localhost:3000}"
AGENT_ID="$(hostname)-$(date +%s)"
GITHUB_RAW="https://raw.githubusercontent.com/octocl/pylaunch/main/admin/public"

echo "==> PyLaunch Agent Setup (server: $SERVER)"

if ! command -v curl &>/dev/null; then
  echo "==> Installing curl..."
  if command -v apt &>/dev/null; then apt update -qq && apt install -y -qq curl
  elif command -v pacman &>/dev/null; then pacman -Sy --noconfirm curl
  else echo "ERROR: install curl manually"; exit 1; fi
fi

if ! command -v docker &>/dev/null; then
  echo "==> Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker 2>/dev/null || true
fi

echo "==> Downloading agent..."
mkdir -p /opt/pylaunch-agent
curl -sL "$GITHUB_RAW/docker-agent.py" -o /opt/pylaunch-agent/agent.py
chmod +x /opt/pylaunch-agent/agent.py

echo "==> Creating systemd service..."
cat > /etc/systemd/system/pylaunch-agent.service <<UNIT
[Unit]
Description=PyLaunch Docker Agent
After=docker.service network-online.target
Wants=docker.service network-online.target

[Service]
ExecStart=/opt/pylaunch-agent/agent.py
Environment=PYLAUNCH_AGENT_ID=$AGENT_ID
Environment=PYLAUNCH_SERVER=$SERVER
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now pylaunch-agent.service
echo "==> Agent running! (id: $AGENT_ID)"
