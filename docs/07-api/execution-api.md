# Execution API

## `POST /api/run`

Submit code for execution.

### Request

```json
{
  "code": "print('hello world')",
  "language": "python",
  "project_id": "uuid-or-null",
  "env": {
    "API_KEY": "value"
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `code` | string | yes | The Python source code |
| `language` | string | no | Default: `"python"` |
| `project_id` | string | no | Save execution under a project |
| `env` | object | no | Environment variables (premium only) |

### Response

`202 Accepted`

```json
{
  "execution_id": "uuid",
  "status": "queued",
  "position": 3
}
```

### WebSocket stream

Connect to `wss://pylaunch.dev/api/run/{execution_id}/stream` to receive live output:

```
[stdout] Hello, world!
[stderr] Warning: deprecated
[exit] 0
```

## `GET /api/run/:id`

Get execution details and output.

### Response

```json
{
  "id": "uuid",
  "status": "completed",
  "output": "Hello, world!\n",
  "exit_code": 0,
  "duration_ms": 342,
  "created_at": "2026-06-29T12:00:00Z"
}
```

## `GET /api/runs`

List execution history for the authenticated user (paginated).

| Query param | Type | Default |
|---|---|---|
| `page` | integer | 1 |
| `per_page` | integer | 20 |
| `project_id` | string | null (all projects) |
