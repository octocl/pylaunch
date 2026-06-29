# Execution Flow

## Detailed sequence

```
User                    API Server             Queue (Redis)      Docker Daemon
 │                         │                       │                  │
 │  POST /api/run          │                       │                  │
 │────────────────────────▶│                       │                  │
 │                         │                       │                  │
 │  ┌─ Rate limit check    │                       │                  │
 │  └─ OK                  │                       │                  │
 │                         │                       │                  │
 │  ┌─ Rate limit update   │                       │                  │
 │  └─ Done                │                       │                  │
 │                         │                       │                  │
 │  ┌─ Check queue depth   │                       │                  │
 │  │  If busy → enqueue   │──────enqueue─────────▶│                  │
 │  │  If free → execute   │                       │                  │
 │  └─                     │                       │                  │
 │                         │  (dequeue later)     │                  │
 │                         │◀─────dequeue──────────│                  │
 │                         │                       │                  │
 │  ┌─ Create container    │──────docker create───▶│                  │
 │  │                      │◀─────container_id─────│                  │
 │  │                      │                       │                  │
 │  ├─ Start container     │──────docker start────▶│                  │
 │  │                      │                       │                  │
 │  ├─ Open WebSocket      │                       │                  │
 │  │◀═══════════ WS connect══════════════════════ │                  │
 │  │                      │                       │                  │
 │  ├─ Stream logs         │◀──────stdout──────────│                  │
 │  │◀═════════ log stream═══════════════════════  │                  │
 │  │                      │                       │                  │
 │  ├─ Wait for exit       │                       │                  │
 │  │                      │◀──────exit code───────│                  │
 │  ├─ Remove container    │──────docker rm───────▶│                  │
 │  │                      │                       │                  │
 │  └─ Save execution      │                       │                  │
 │     to PostgreSQL       │                       │                  │
 │                         │                       │                  │
 │◀────────────────────────│                       │                  │
 │  Response (exit code,   │                       │                  │
 │  duration, output URL)  │                       │                  │
```

## Error cases

| Scenario | HTTP status | Behavior |
|---|---|---|
| Container startup fails | 502 | Save error to execution history; frontend shows "Container failed to start" |
| Script times out | — | Kill container with SIGTERM → SIGKILL after 5s; return partial output with timeout warning |
| User disconnects mid-run | — | Container continues until completion/timeout; output saved; user sees "Reconnecting..." on return |
| Rate limit exceeded | 429 | No container created; response includes `Retry-After` header; frontend shows countdown |
| Queue full (concurrent limit) | 503 | `Retry-After` header; frontend queues locally with notification |
| WebSocket disconnect | — | Client auto-reconnects with exponential backoff (1s, 2s, 4s, 8s, max 30s); server resumes stream |
| Invalid code (syntax error) | 200 | Returned as stderr output with non-zero exit code; no special handling needed |
| Container OOM killed | — | stderr shows "Killed" message; exit code 137; frontend shows "Out of memory" |
| Unauthorized WS connection | 403 | WebSocket upgrade denied; connection closed with 403 close frame |
| User navigates away during execution | — | Execution continues in background; results available in history |
| Server restart during execution | — | Container destroyed; execution marked as "lost"; user sees "Server disconnected — please re-run" |
