# Database

## PostgreSQL

Primary data store for all persistent entities.

### Schema overview

```sql
-- Users
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT UNIQUE NOT NULL,
    username    TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    tier        TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'premium'
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sessions
CREATE TABLE sessions (
    token       TEXT PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id),
    expires_at  TIMESTAMPTZ NOT NULL
);

-- Projects
CREATE TABLE projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id),
    name        TEXT NOT NULL,
    code        TEXT NOT NULL,
    language    TEXT NOT NULL DEFAULT 'python',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Execution history
CREATE TABLE executions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id),       -- NULL for guest
    project_id  UUID REFERENCES projects(id),
    status      TEXT NOT NULL DEFAULT 'pending', -- pending|running|completed|failed|timeout
    output      TEXT,
    exit_code   INTEGER,
    duration_ms INTEGER,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rate limits (for tracking usage)
CREATE TABLE usage_logs (
    id          BIGSERIAL PRIMARY KEY,
    identifier  TEXT NOT NULL,     -- IP or user_id
    action      TEXT NOT NULL,     -- 'execute' | 'create_project'
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Indexes

- `executions(user_id, created_at DESC)` — for execution history queries
- `usage_logs(identifier, created_at)` — for rate limit lookups
- `sessions(expires_at)` — for periodic cleanup

## Redis

Used for ephemeral, high-throughput data:

| Purpose | Data structure | TTL |
|---|---|---|
| Execution queue | List (brpop) | N/A |
| Rate limit buckets | String (counter) | Window duration |
| Session cache | String (JSON) | Session TTL |
| WebSocket pub/sub | Pub/Sub channels | N/A |

## Why two data stores?

PostgreSQL is the source of truth for all persistent data. Redis handles high-frequency, short-lived data that would be wasteful in Postgres — rate limit counters updated on every request, the execution queue polled by workers, and real-time pub/sub for log streaming.
