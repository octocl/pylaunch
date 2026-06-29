# Docker Isolation

Every execution runs inside a separate Docker container with strict isolation guarantees.

## Container-level isolation

```
┌─────────────────────────────────────────────────┐
│                   Host Machine                    │
│                                                   │
│  ┌─────────────────────┐  ┌─────────────────────┐│
│  │  Container A         │  │  Container B         ││
│  │  ┌───────────────┐   │  │  ┌───────────────┐   ││
│  │  │ User code     │   │  │  │ User code     │   ││
│  │  │ Python 3.11   │   │  │  │ Python 3.11   │   ││
│  │  │ /tmp (64 MB)  │   │  │  │ /tmp (64 MB)  │   ││
│  │  │ PID 1: python │   │  │  │ PID 1: python │   ││
│  │  └───────────────┘   │  │  └───────────────┘   ││
│  │  CPU: 0.5            │  │  CPU: 0.5            ││
│  │  RAM: 256 MB         │  │  RAM: 256 MB         ││
│  └─────────────────────┘  └─────────────────────┘  │
│                         │                          │
│                         ▼                          │
│              ┌─────────────────────┐               │
│              │  Docker Daemon      │               │
│              │  (rootless mode)    │               │
│              └─────────────────────┘               │
└─────────────────────────────────────────────────┘
```

## Security measures

| Measure | Implementation |
|---|---|
| **Read-only rootfs** | Container root is mounted read-only; only `/tmp` is writable |
| **No capabilities** | `--cap-drop=ALL` — no Linux capabilities granted |
| **No privilege escalation** | `--security-opt=no-new-privileges:true` |
| **Seccomp** | Default Docker seccomp profile applied |
| **AppArmor** | Docker default AppArmor profile |
| **Resource limits** | CPU, memory, and disk quotas enforced by cgroups |
| **Network** | Internet access via bridge network; no access to host network. Egress filtering applied (see below). |
| **No host mounts** | User code is copied in, not mounted from host (except tmpfs) |
| **Ephemeral** | Containers are destroyed after execution; no reuse |

## Kernel-level isolation

- Each container runs in its own PID, mount, UTS, IPC, and network namespace
- cgroups enforce resource limits and prevent noisy-neighbor problems
- User namespaces map the container's root user to a non-root host UID

## Egress filtering

User containers have unrestricted internet access by default. To prevent abuse (data exfiltration, C2 callbacks, DDoS participation), egress filtering is applied:

### Approach: iptables + ipset

```
Host iptables rules (applied to docker bridge interface):
  - Allow outbound DNS (udp 53) — required for pip installs and API calls
  - Allow outbound HTTP/HTTPS (tcp 80, 443) — required for pip, REST APIs
  - Block all other outbound traffic (tcp/udp high ports, ICMP, etc.)
  - Rate-limit outbound connections per container (e.g., 100/min)
```

### Implementation

```bash
# Create ipset for allowed destinations (optional for MVP)
ipset create pylaunch-allow hash:net

# Apply iptables rules to Docker bridge interface
iptables -A FORWARD -i docker0 -p udp --dport 53 -j ACCEPT
iptables -A FORWARD -i docker0 -p tcp -m multiport --dports 80,443 -j ACCEPT
iptables -A FORWARD -i docker0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A FORWARD -i docker0 -j DROP

# Rate limit outbound connections
iptables -A FORWARD -i docker0 -p tcp --dport 80 -m limit --limit 100/min -j ACCEPT
iptables -A FORWARD -i docker0 -p tcp --dport 443 -m limit --limit 100/min -j ACCEPT
```

### Limitations

- Egress filtering cannot prevent all abuse (e.g., HTTP-based C2 on port 443 is still possible)
- It raises the bar significantly: scanning, data exfiltration to non-HTTP services, and DDoS participation are blocked
- For stricter isolation (post-MVP): proxy all outbound traffic through an HTTP forward proxy with allow-listing

### Future improvements

- HTTP forward proxy (Squid, tinyproxy) with domain allow-listing
- DNS filtering (block known malware/C2 domains)
- Per-container network namespaces with dedicated iptables rules
- Outbound traffic logging for abuse detection

## After execution

The container is always removed, regardless of how execution ends (success, error, timeout, or user disconnect). No container persists between executions.
