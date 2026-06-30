#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────
# PyLaunch VPS Agent — fully automated setup
# Supports: Arch Linux, Ubuntu (20.04+), Debian (11+)
# ──────────────────────────────────────────────────

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
NC="\033[0m"

log()  { printf "${GREEN}✓${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}⚠${NC} %s\n" "$1"; }
fail() { printf "${RED}✗${NC} %s\n" "$1"; exit 1; }
info() { printf "${CYAN}→${NC} %s\n" "$1"; }

# ── Detect OS ──────────────────────────────────────
detect_os() {
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS_ID="$ID"
    OS_LIKE="$ID_LIKE"
  elif command -v pacman &>/dev/null; then
    OS_ID="arch"
  elif command -v apt-get &>/dev/null; then
    OS_ID="debian"
  else
    fail "Unsupported OS. Only Arch Linux, Ubuntu, and Debian are supported."
  fi
}

# ── Install Docker ─────────────────────────────────
install_docker() {
  if command -v docker &>/dev/null; then
    log "Docker already installed"
    return
  fi

  info "Installing Docker..."

  case "$OS_ID" in
    arch|"arch")
      pacman -Sy --noconfirm docker
      systemctl enable --now docker
      ;;
    ubuntu|debian)
      apt-get update -qq
      apt-get install -y -qq ca-certificates curl
      install -m 0755 -d /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/"${OS_ID}"/gpg \
        -o /etc/apt/keyrings/docker.asc
      chmod a+r /etc/apt/keyrings/docker.asc
      echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
        https://download.docker.com/linux/${OS_ID} $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
        | tee /etc/apt/sources.list.d/docker.list > /dev/null
      apt-get update -qq
      apt-get install -y -qq docker-ce docker-ce-cli containerd.io
      systemctl enable --now docker
      ;;
    *)
      fail "Cannot install Docker automatically on $OS_ID. Please install Docker manually."
      ;;
  esac

  log "Docker installed"
}

# ── Build agent image ──────────────────────────────
build_agent() {
  local src_dir="$1"

  info "Building PyLaunch agent Docker image..."
  docker build -t pylaunch-agent:latest "$src_dir"
  log "Agent image built: pylaunch-agent:latest"
}

# ── Create systemd service ─────────────────────────
create_service() {
  local server_url="$1"

  cat > /etc/systemd/system/pylaunch-agent.service <<EOF
[Unit]
Description=PyLaunch VPS Agent
After=docker.service
Requires=docker.service

[Service]
Restart=always
RestartSec=10
ExecStartPre=-/usr/bin/docker rm -f pylaunch-agent 2>/dev/null
ExecStart=/usr/bin/docker run \\
  --rm \\
  --name pylaunch-agent \\
  -e PYLAUNCH_SERVER="${server_url}" \\
  -e PYLAUNCH_AGENT_ID="$(hostname)" \\
  -v /var/run/docker.sock:/var/run/docker.sock:ro \\
  pylaunch-agent:latest
ExecStop=/usr/bin/docker stop -t 5 pylaunch-agent
TimeoutStartSec=60
TimeoutStopSec=10

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable --now pylaunch-agent
  log "Agent service installed and started"
}

# ── Main ───────────────────────────────────────────
main() {
  printf "\n${BOLD}${CYAN}━━━ PyLaunch VPS Agent Setup ━━━${NC}\n\n"

  # Detect OS
  detect_os
  log "Detected OS: ${OS_ID}"

  # Ensure root
  if [ "$(id -u)" -ne 0 ]; then
    fail "This script must be run as root (sudo)"
  fi

  # Install Docker
  install_docker

  # Get server URL
  local server_url=""
  while [ -z "$server_url" ]; do
    printf "\n${CYAN}Enter your PyLaunch server URL${NC}\n"
    printf "  (e.g. http://your-server-ip:3000): "
    read -r server_url
    if [ -z "$server_url" ]; then
      warn "Server URL is required"
    fi
  done

  # Create agent directory
  local agent_dir="/opt/pylaunch-agent"
  mkdir -p "$agent_dir"

  # Copy agent.py
  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  if [ -f "$script_dir/agent.py" ]; then
    cp "$script_dir/agent.py" "$agent_dir/"
  elif [ -f "$script_dir/agent/agent.py" ]; then
    cp "$script_dir/agent/agent.py" "$agent_dir/"
  else
    # Download from server
    info "Downloading agent.py from server..."
    curl -fsSL "${server_url}/api/agent/download" -o "$agent_dir/agent.py" || \
      fail "Could not find agent.py locally or download from server"
  fi

  # Create Dockerfile for agent
  cat > "$agent_dir/Dockerfile" <<'DOCKERFILE'
FROM python:3.12-slim

RUN addgroup --system --gid 1001 pylaunch \
    && adduser --system --uid 1001 --ingroup pylaunch --home /app pylaunch

WORKDIR /app

COPY agent.py .

USER pylaunch

ENV PYLAUNCH_SERVER=http://localhost:3000

ENTRYPOINT ["python3", "agent.py"]
DOCKERFILE

  # Build image
  build_agent "$agent_dir"

  # Create systemd service
  create_service "$server_url"

  printf "\n${BOLD}${GREEN}━━━ Setup Complete ━━━${NC}\n\n"
  printf "  Agent ID  : $(hostname)\n"
  printf "  Server    : ${server_url}\n"
  printf "  Status    : ${GREEN}Active${NC}\n\n"
  printf "  View logs : journalctl -u pylaunch-agent -f\n\n"
}

main "$@"
