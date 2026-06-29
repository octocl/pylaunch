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
| **Network** | Internet access via bridge network; no access to host network |
| **No host mounts** | User code is copied in, not mounted from host (except tmpfs) |
| **Ephemeral** | Containers are destroyed after execution; no reuse |

## Kernel-level isolation

- Each container runs in its own PID, mount, UTS, IPC, and network namespace
- cgroups enforce resource limits and prevent noisy-neighbor problems
- User namespaces map the container's root user to a non-root host UID

## After execution

The container is always removed, regardless of how execution ends (success, error, timeout, or user disconnect). No container persists between executions.
