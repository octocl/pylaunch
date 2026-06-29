# Abuse Prevention

## Threat model

| Threat | Mitigation |
|---|---|
| Crypto mining | Resource limits (CPU/memory/timeout) make mining unprofitable |
| DDoS / spam | Rate limiting + IP reputation + CAPTCHA for guest execution |
| Code injection | Docker isolation prevents host access |
| Data exfiltration | Network access is allowed; no sensitive host data is accessible in containers |
| Account farming | Email verification + CAPTCHA on signup |
| Serving malicious content | Output is stored and logged; abuse reporting mechanism |
| Resource exhaustion | Per-user and per-IP rate limits; queue depth limits |

## Monitoring

- **Execution logs** — all code submissions and outputs are logged with timestamps
- **Anomaly detection** — flag accounts that exceed normal usage patterns
- **Abuse reporting** — users can report projects/executions via UI
- **Admin dashboard** — view active executions, rate limit hits, flagged accounts

## Response to abuse

| Severity | Action |
|---|---|
| Rate limit violation | Automatic 429 response |
| Suspicious pattern | Manual review, temporary rate limit increase |
| Confirmed abuse | Account suspension, IP block, report to hosting provider if illegal |
| Illegal content | Immediate takedown, cooperate with authorities |

## Design philosophy

Abuse prevention is layered. The first layer is automated (rate limits, resource limits). The second layer is manual (admin review, user reports). The goal is to make abuse economically unattractive without creating friction for legitimate users.
