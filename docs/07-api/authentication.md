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
