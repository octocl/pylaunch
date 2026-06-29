# Discord Bots

PyLaunch is well-suited for running and testing Discord bots without hosting them on a VPS.

## How it works

Write a Discord bot script using `discord.py`, upload it to PyLaunch, and run it. The bot stays alive for the duration of the execution timeout. For persistent bots, a webhook-based approach or scheduled re-runs can be used.

## Example use case

- Testing bot commands before deploying to production
- Running one-off moderation scripts
- Prototyping slash commands
- Debugging API interactions

## Limitations

- Bots stop when the execution timeout is reached (60-300s depending on tier)
- For 24/7 bots, PyLaunch is not suitable without external keep-alive mechanisms
- The bot must use the `discord.py` library (pre-installed or `pip install` at runtime)
