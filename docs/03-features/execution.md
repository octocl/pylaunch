# Execution

## How execution works

1. User submits code (via editor, file upload, or API)
2. Code is written to a temporary file inside the Docker container
3. Container runs `python <file>` and streams stdout/stderr
4. WebSocket connection pipes output to the browser terminal
5. On exit, the container is destroyed and the result is stored

## Supported Python features

- **Standard library** — full access
- **`pip install`** — packages can be installed at runtime (subject to timeout)
- **File I/O** — limited to `/tmp` within the container
- **Network** — full internet access (HTTP, WebSocket, TCP/UDP)
- **Environment variables** — user-configurable per project (premium feature)

## Timeout limits

| Tier | Timeout |
|---|---|
| Guest | 60 seconds |
| Free (registered) | 120 seconds |
| Premium | 300 seconds |

Scripts that exceed the timeout are killed with SIGTERM, then SIGKILL after 5 seconds.

## Resource limits

| Resource | Guest / Free | Premium |
|---|---|---|
| CPU | 0.5 cores | 1 core |
| Memory | 256 MB | 1 GB |
| Disk (writable) | 64 MB (/tmp) | 256 MB (/tmp) |
| Concurrent executions | 1 | 3 |

## Output

- stdout and stderr are interleaved in order
- Output is limited to 1 MB per execution (excess is truncated with a warning line: `[!] Output truncated at 1 MB`)
- Exit code is always returned
- Full output is saved in PostgreSQL for registered users

## User-visible states during execution

| State | What happens | User sees |
|---|---|---|
| **Queued** | Request waiting in Redis queue | Footer: "Queued — position #3" |
| **Starting** | Docker container being created | Footer: "Starting container..." with spinner |
| **Running** | Script executing | Footer: "Running — 12.3s" with live timer |
| **Stopping** | Container being destroyed | Footer: "Stopping..." |
| **Completed** | Script finished with exit code 0 | Footer: "Completed — 2.3s" in green |
| **Failed** | Script finished with non-zero exit code | Footer: "Failed — exit code 1" in red |
| **Timed out** | Execution exceeded time limit | Footer: "Timed out — 60s limit" with partial output |
| **OOM killed** | Container ran out of memory | Footer: "Out of memory — 256 MB limit" |
| **Error** | Infrastructure failure (Docker, network) | Footer: "Error — container failed to start" with retry button |
| **Disconnected** | WebSocket lost | Banner: "Reconnecting..." with auto-retry |

## Edge cases

| Scenario | Behavior |
|---|---|
| User opens same project in two tabs | Each tab creates its own execution; no conflict |
| User navigates away during execution | Execution continues; output saved to history |
| User closes browser mid-execution | Container continues until timeout; output saved |
| Browser tab goes to background | WebSocket may disconnect; auto-reconnect on return |
| Multiple rapid "Run" clicks | Each click creates a new execution; free tier limited to 1 concurrent |
| File upload exceeds size limit | Rejected with message: "File too large (max 1 MB)" |
| Script with infinite loop | Killed at timeout; partial output returned |
| pip install takes too long | Counts against execution timeout; no separate timeout |
