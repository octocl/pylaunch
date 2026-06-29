# Telegram Bots

Similar to Discord bots, PyLaunch can run Telegram bot scripts for testing and short-lived automation.

## How it works

Write a bot using `python-telegram-bot` or `aiogram`, upload to PyLaunch, and run. The bot polls for updates during the execution window.

## Example use case

- Testing webhook integrations
- Running polling-based bots for timed tasks
- Prototyping inline query handlers
- Debugging bot responses

## Limitations

- Same timeout constraints as Discord bots
- Webhook mode requires a public HTTPS endpoint (not available on PyLaunch)
- Long-polling works but only while the script is running
