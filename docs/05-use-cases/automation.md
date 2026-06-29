# Automation

PyLaunch can run scheduled or trigger-based automation scripts.

## Example use cases

- **File processing** — download a file, transform it, upload somewhere else
- **Email reports** — generate a report and send it via SMTP
- **Database maintenance** — run a script that connects to a remote DB and cleans up old records
- **Scraping** — periodically scrape a site and store results
- **Notifications** — check a condition and send a notification (Telegram, Slack, email)

## How to automate

Since PyLaunch does not natively support cron jobs, automation requires an external trigger:

1. **GitHub Actions** — use the PyLaunch REST API to trigger a script on a schedule
2. **Manual** — log in and re-run a saved project
3. **Webhook** — use an external service (e.g., Pipedream, Make) to call the PyLaunch API

## Limitations

- No native scheduling (MVP)
- External trigger required for recurring automation
- Execution timeout still applies
