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
- Output is limited to 1 MB per execution (excess is truncated with a warning)
- Exit code is always returned
- Full output is saved in PostgreSQL for registered users
