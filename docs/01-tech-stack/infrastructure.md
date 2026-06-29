# Infrastructure

## Deployment model

Self-hosted on a dedicated Linux server. No cloud vendor dependency.

### Hardware estimate

| Resource | Allocation |
|---|---|
| CPU | 8+ cores (modern x86_64) |
| RAM | 32 GB total (10 GB reserved for user containers) |
| Storage | 256 GB SSD (OS, images, project data, logs) |
| Network | 1 Gbps symmetric |

## Services

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│  Rust API   │────▶│ PostgreSQL  │
│  (reverse   │     │  (Axum)     │     │             │
│   proxy)    │     │             │     └─────────────┘
└─────────────┘     │             │     ┌─────────────┐
       │            │             │────▶│    Redis     │
       │            └──────┬──────┘     └─────────────┘
       ▼                   ▼
┌─────────────┐    ┌──────────────┐
│  Next.js    │    │   Docker     │
│ (frontend)  │    │  (containers)│
└─────────────┘    └──────────────┘
```

### Nginx

- Reverse proxy for both the Rust API and the Next.js frontend
- TLS termination (Let's Encrypt)
- Rate limiting at the edge
- Static asset caching

### Redis

- Execution queue (brpop-lpush pattern)
- Rate limit counters
- Session cache
- Real-time pub/sub for WebSocket output streaming

### PostgreSQL

- User accounts and sessions
- Saved projects and execution history
- Usage metrics for billing/ad analytics

## Container resource limits

Each user container is constrained by Docker:

```bash
--memory=256m   # 256 MB RAM per container
--cpus=0.5      # half a CPU core
--timeout=300   # 5 minute max execution
```

Premium users get relaxed limits: 1 GB RAM, 1 CPU, 15 minute timeout.
