# Advertisements

PyLaunch is free because it is supported by advertisements.

## Ad placement

Ads are displayed in two locations:

1. **Output panel** — a non-intrusive banner below the terminal output area
2. **Dashboard sidebar** — for registered users on the dashboard page

No ads appear inside the code editor or the terminal output itself.

## Ad format

- Text + image banner (responsive, max 728x90)
- No auto-play video or audio
- No pop-ups or interstitials
- No deceptive "download" buttons

## Premium tier

Premium subscribers see zero advertisements. The premium tier is the monetization path for users who want an ad-free experience.

## Implementation

- Ad content is served from an ad network (e.g., Carbon Ads, EthicalAds, or direct-sold)
- Ad slot is a server-side include or client-side component that fetches from the ad provider
- Ad impressions are tracked server-side for analytics
- Premium users are identified by JWT claim; the frontend hides ad components
