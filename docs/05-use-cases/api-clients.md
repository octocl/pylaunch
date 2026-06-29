# API Clients

PyLaunch can be used as an interactive REST API client.

## How it works

Write a Python script that calls an external API, run it on PyLaunch, and see the response in the output panel.

## Example use cases

- **Testing API keys** — verify that an API key works before using it in production
- **Prototyping integrations** — quickly test API endpoints without Postman
- **Data transformation** — fetch data from one API, transform it, post to another
- **Webhook debugging** — simulate webhook payloads

## Advantages over local

- No Python installed locally
- No `.env` files to manage (environment variables stored in PyLaunch)
- Works from any device (phone, tablet, Chromebook)
- Results are saved in execution history

## Example

```python
import requests

resp = requests.get(
    "https://api.github.com/repos/octocl/pylaunch",
    headers={"Accept": "application/vnd.github.v3+json"}
)
print(resp.status_code)
print(resp.json()["description"])
```
