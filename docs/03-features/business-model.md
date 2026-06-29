# Business Model

## Revenue model: Freemium (ad-supported + premium subscriptions)

PyLaunch uses a two-tier revenue model:

1. **Free tier** — supported by non-intrusive advertisements
2. **Premium tier** — $5/month subscription for higher limits and an ad-free experience

## Unit economics (projected)

### Costs

| Item | Monthly cost (est.) | Notes |
|---|---|---|
| Dedicated server (8 CPU, 32 GB RAM, 256 GB SSD, 1 Gbps) | ~$80–120 | Hetzner, OVH, or similar |
| Domain + DNS | ~$2 | |
| Ad network overhead | ~10% of ad revenue | |
| Stripe fees | 2.9% + $0.30 per transaction | Premium subscriptions |
| Total base | ~$90–140/mo | |

### Per-execution cost estimate

| Resource | Free tier | Cost per execution (est.) |
|---|---|---|
| CPU (0.5 core × 60s avg) | ~0.5 CPU-min | ~$0.00008 |
| Memory (256 MB × 60s avg) | ~0.256 GB-min | ~$0.00004 |
| Container overhead | Boot + destroy | ~$0.00002 |
| **Total per execution** | | **~$0.00014** |

Assuming 100,000 executions/month at free tier:
- Estimated cost: ~$14/month in compute resources
- Server base cost: ~$100/month
- **Total: ~$114/month**

### Ad revenue projection

| Metric | Conservative | Moderate | Optimistic |
|---|---|---|---|
| Monthly active users | 5,000 | 20,000 | 50,000 |
| Ad impressions/user/month | ~30 | ~30 | ~30 |
| Total monthly impressions | 150,000 | 600,000 | 1,500,000 |
| Effective CPM (Carbon/EthicalAds) | $3–5 | $5–8 | $8–12 |
| **Monthly ad revenue** | **$450–750** | **$3,000–4,800** | **$12,000–18,000** |

### Premium subscription projections

| Metric | Conservative | Moderate | Optimistic |
|---|---|---|---|
| User base | 5,000 | 20,000 | 50,000 |
| Conversion rate | 1% | 2% | 4% |
| Premium subscribers | 50 | 400 | 2,000 |
| Revenue at $5/mo | $250 | $2,000 | $10,000 |
| Stripe fees (~5%) | $12.50 | $100 | $500 |
| **Net premium revenue** | **~$237/mo** | **~$1,900/mo** | **~$9,500/mo** |

### Total projected revenue

| Scenario | Ad revenue | Premium revenue | Total | Cover costs? |
|---|---|---|---|---|
| Conservative | $450 | $237 | **$687/mo** | ✅ Yes (5x costs) |
| Moderate | $3,000 | $1,900 | **$4,900/mo** | ✅ Yes (35x costs) |
| Optimistic | $12,000 | $9,500 | **$21,500/mo** | ✅ Yes (150x costs) |

## Key risks

1. **Ad revenue lower than projected** — EthicalAds/Carbon Ads CPMs vary by audience and region. A CPM of $1–2 would significantly reduce revenue.
2. **Low premium conversion** — If conversion is <0.5%, premium revenue becomes negligible.
3. **Abuse driving up costs** — Crypto mining or DDoS attacks could dramatically increase compute costs per user.
4. **Server costs higher than estimated** — Cloud provider pricing (if not self-hosted) could be 2–3x higher.

## Mitigation strategies

- **Start self-hosted** (dedicated server) to keep base costs low
- **Monitor unit economics** — track cost per execution and revenue per user from day one
- **Adjust rate limits dynamically** — tighten limits if abuse drives costs up
- **Test CPM rates early** — run a small ad campaign before launch to validate revenue assumptions
- **Consider a usage-based premium tier** — e.g., $5 for 1000 executions, $10 for 5000 executions

## Recommendation

Move from a pure ad-supported model to a **freemium model**. This is financially safer and more predictable. The free tier remains genuinely useful (unlike competitors' highly throttled free tiers), while premium provides a sustainable revenue base.
