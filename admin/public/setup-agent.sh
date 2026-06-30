#!/usr/bin/env bash
set -e
SERVER="${1:-http://localhost:3000}"
AGENT_ID="$(hostname)-$(date +%s)"
GITHUB_RAW="https://raw.githubusercontent.com/octocl/pylaunch/main/admin/public"

[ "$EUID" = 0 ] || { command -v sudo &>/dev/null && exec sudo "$0" "$@"; exec su -c "\"$0\" $*"; }

echo "==> PyLaunch Agent Setup (server: $SERVER)"

install_pkg() {
  if command -v apt &>/dev/null; then apt update -qq && apt install -y -qq "$1"
  elif command -v dnf &>/dev/null; then dnf install -y -q "$1"
  elif command -v yum &>/dev/null; then yum install -y -q "$1"
  elif command -v pacman &>/dev/null; then pacman -Sy --noconfirm "$1"
  elif command -v zypper &>/dev/null; then zypper install -y "$1"
  elif command -v apk &>/dev/null; then apk add --no-cache "$1"
  elif command -v brew &>/dev/null; then brew install "$1"
  else echo "ERROR: no package manager found, install $1 manually"; exit 1; fi
}

download() {
  if command -v curl &>/dev/null; then curl -sL "$1"
  elif command -v wget &>/dev/null; then wget -qO- "$1"
  elif command -v python3 &>/dev/null; then python3 -c "import urllib.request; import sys; sys.stdout.buffer.write(urllib.request.urlopen(sys.argv[1]).read())" "$1"
  else install_pkg curl && curl -sL "$1"; fi
}

if ! command -v curl &>/dev/null && ! command -v wget &>/dev/null; then
  echo "==> Installing curl..."
  install_pkg curl
fi

if ! command -v docker &>/dev/null; then
  echo "==> Installing Docker..."
  if command -v apk &>/dev/null; then
    apk add --no-cache docker
    rc-update add docker boot && service docker start
  elif command -v brew &>/dev/null; then
    brew install --cask docker
  else
    download "https://get.docker.com" | sh
  fi
fi

echo "==> Downloading agent..."
mkdir -p /opt/pylaunch-agent
download "$GITHUB_RAW/docker-agent.py" > /opt/pylaunch-agent/agent.py
chmod +x /opt/pylaunch-agent/agent.py

echo "==> Installing service..."
if [ -d /run/systemd/system ]; then
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
elif command -v rc-update &>/dev/null; then
  cat > /etc/init.d/pylaunch-agent <<INIT
#!/sbin/openrc-run
command="/opt/pylaunch-agent/agent.py"
command_background=true
pidfile="/run/pylaunch-agent.pid"
INIT
  chmod +x /etc/init.d/pylaunch-agent
  rc-update add pylaunch-agent default
  rc-service pylaunch-agent start
  echo "==> Agent running! (id: $AGENT_ID)"
else
  echo "==> Starting agent in foreground..."
  echo "    Agent ID: $AGENT_ID   Server: $SERVER"
  echo "    (Press Ctrl+C to stop)"
  echo ""
  cd /opt/pylaunch-agent
  exec /opt/pylaunch-agent/agent.py
fi
