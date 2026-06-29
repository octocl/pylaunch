# Guest Mode

Guests can use PyLaunch without creating an account. This is the primary "funnel" — users hit the landing page, click "Try it now", and start coding in seconds.

## Capabilities

| Feature | Guest |
|---|---|
| Upload `.py` file | Yes |
| Write code in editor | Yes |
| Run code | Yes |
| View live output | Yes |
| Save project | No |
| Execution history | No (session only) |
| Re-run | No (must re-upload/paste) |
| Internet access | Yes |
| Ad-supported | Yes |

## Guest identification

Guests are identified by IP address + browser fingerprint for rate limiting. No cookies or local storage are required for basic execution.

## Session behavior

- Guest state (code in editor) persists for the browser session via localStorage
- Refreshing the page resets the editor to empty
- Execution history is shown only during the current page visit

## Conversion prompt

After a successful guest execution, a non-blocking prompt invites the user to sign up:

> "Want to save this project? Create a free account."
