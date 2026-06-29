# Rate Limits

Rate limits protect the platform from abuse and ensure fair resource distribution.

## Limits by tier

| Limit | Guest | Free (registered) | Premium |
|---|---|---|---|
| Executions per hour | 5 | 20 | 100 |
| API requests per minute | 10 | 30 | 120 |
| Concurrent executions | 1 | 1 | 3 |
| Max file upload size | 1 MB | 5 MB | 10 MB |

## Implementation

Rate limiting uses a **sliding window** algorithm with Redis as the backing store:

```
Key:    ratelimit:{identifier}:{action}:{window}
Value:  counter (INCR)
TTL:    window duration (e.g., 3600s for hourly)
```

When a request comes in:

1. INCR the counter for the identifier+action+current_window
2. If counter > limit, reject with HTTP 429 and `Retry-After` header
3. Otherwise, allow the request

## Headers

All responses include rate limit headers:

```http
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1625097600
```

## Bypassing limits

- Premium users have higher limits
- No IP-based bypass; VPN/proxy usage is handled at the infrastructure level
- Rate limits apply per-identifier, not per-IP (for registered users, the identifier is user_id; for guests, it's IP)
