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

| Scenario | Behavior |
|---|---|
| Container startup fails | Return 502, save error to execution history |
| Script times out (5 min) | Kill container, return partial output |
| User disconnects mid-run | Container continues running until completion/timeout, output is saved |
| Rate limit exceeded | Return 429, no container created |
| Concurrent queue full | Return 503 with retry-after header |
