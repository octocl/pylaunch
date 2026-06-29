# Docker

## Image strategy

PyLaunch uses a **custom base image** built on `python:3.11-slim`:

```dockerfile
FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    requests \
    httpx \
    aiohttp \
    beautifulsoup4 \
    python-dotenv

COPY runner.py /runner.py
ENTRYPOINT ["python", "/runner.py"]
```

The `runner.py` script reads the user's code from stdin or a mounted volume, executes it, and streams output to stdout.

### Multi-version support

Future: maintain tagged images for Python 3.9, 3.10, 3.11, 3.12 so users can select their version.

## Container lifecycle

```
Request received
      │
      ▼
Pull image (cached, fast)
      │
      ▼
Create container (resource limits applied)
      │
      ▼
Start container
      │
      ▼
Stream stdout/stderr via WebSocket
      │
      ▼
Wait for exit (or timeout)
      │
      ▼
Remove container (always, even on timeout/error)
      │
      ▼
Return exit code + full output
```

## Security

- `--network` — containers have internet access via the host bridge
- `--read-only` — container filesystem is read-only except `/tmp`
- `--cap-drop=ALL` — drop all Linux capabilities
- `--security-opt=no-new-privileges:true` — prevent privilege escalation
- Resource limits prevent DoS (CPU, memory, disk)

## Image caching

Base images are pre-pulled and cached on the host. User code is injected at runtime, not baked into images, so there is no per-user image build.
