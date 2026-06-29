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

Connect to `wss://pylaunch.dev/api/run/{execution_id}/stream` to receive live output.

**Authentication:**
- Authenticated users: pass `Authorization: Bearer <token>` as a header during the WebSocket handshake (browser WebSocket API supports headers via `new WebSocket(url, { headers })` or `protocols` field)
- Guest users: the WebSocket connection is tied to the IP address that created the execution (same-IP verification)
- The server verifies the user owns the `execution_id` before streaming; unauthorized connections receive a 403 close frame

**Verification flow:**
1. Client initiates WebSocket upgrade to `wss://pylaunch.dev/api/run/{execution_id}/stream`
2. Server reads the `Authorization` header from the upgrade request
3. If valid JWT: verify the token's user_id matches the execution's owner_id
4. If no JWT: verify the request IP matches the execution's creator IP
5. On success: begin streaming stdout/stderr
6. On failure: close connection with `403 Forbidden` close code

**Protocol:**
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
