# Authentication

## Endpoints

### `POST /api/auth/register`

Create a new account.

```json
{
  "email": "user@example.com",
  "username": "cooluser",
  "password": "securepassword123"
}
```

Response: `201 Created`

```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "cooluser",
    "tier": "free"
  }
}
```

### `POST /api/auth/login`

Authenticate and receive a JWT.

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response: `200 OK`

```json
{
  "token": "jwt-token-here",
  "user": { "...same as register..." }
}
```

### `POST /api/auth/logout`

Invalidate the current session. Requires `Authorization: Bearer <token>`.

Response: `204 No Content`

## Session

- JWT tokens expire after 7 days
- Token is sent as `Authorization: Bearer <token>` header
- Guest requests carry no auth header and are identified by IP
- Rate limits apply per-user or per-IP depending on auth state

## Pluggable authentication

Requests can be authenticated in two ways:

| Method | Used for | Header |
|---|---|---|
| Session JWT | Interactive web app | `Authorization: Bearer <jwt>` |
| API key | Programmatic / CI/CD | `Authorization: Bearer <api_key>` |

The same middleware handles both — it tries JWT first, then API key.

## API keys (planned — medium-term)

API keys enable programmatic access for CI/CD, automation, and third-party integrations.

### Key format

```
pylaunch_sk_<base64url-encoded-32-bytes>
```

Example: `pylaunch_sk_abc123...xyz`

### Key properties

| Property | Value |
|---|---|
| Prefix | `pylaunch_sk_` (distinguishable from JWT) |
| Length | 64 characters total |
| Encoding | base64url (no special characters) |
| Entropy | 256 bits (cryptographically random) |

### Scopes

| Scope | Permission |
|---|---|
| `execution:run` | Submit code for execution |
| `execution:read` | View execution history and output |
| `projects:read` | List and view projects |
| `projects:write` | Create, update, delete projects |
| `admin:read` | View usage metrics (admin keys) |

Keys can be assigned one or more scopes. A key without `execution:run` cannot execute code.

### Rate limits

API keys have separate, configurable rate limits from session-based auth:

| Tier | Rate limit |
|---|---|
| Free | 100 requests/hour, 10 concurrent executions |
| Premium | 1000 requests/hour, 50 concurrent executions |

### Management endpoints

| Endpoint | Description |
|---|---|
| `POST /api/auth/keys` | Create a new API key |
| `GET /api/auth/keys` | List active API keys (masked) |
| `DELETE /api/auth/keys/:id` | Revoke an API key |
| `PATCH /api/auth/keys/:id` | Update key scopes or name |

### Security considerations

- API keys are stored as bcrypt/SHA-256 hashes in the database (not plaintext)
- The full key is shown exactly once at creation time
- Keys can be rotated by creating a new key and revoking the old one
- Revoked keys are immediately rejected by the auth middleware
- No API key can access the authentication endpoints (register, login, etc.)
