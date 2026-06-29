# Web Scraping

PyLaunch is a convenient environment for running web scraping scripts.

## Why PyLaunch for scraping?

- No need to install `requests`, `beautifulsoup4`, `scrapy`, or `selenium` locally
- Full internet access means you can reach any public website
- Output is saved and can be exported
- Easy to iterate — edit, run, see results, repeat

## Example script types

- **Simple HTML parsing** — `requests` + `BeautifulSoup`
- **API scraping** — `httpx` to consume public REST APIs
- **JavaScript-heavy sites** — can install `playwright` or `selenium` (but limited)
- **CSV/JSON export** — parse data and output structured text

## Limitations

- Browser automation (Selenium, Playwright) is possible but slow and limited
- Sites that require a persistent login session are harder to work with
- IP-based rate limiting on target sites affects scraping from PyLaunch
- Not suitable for large-scale scraping (volume limits apply)
