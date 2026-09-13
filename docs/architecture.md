---
status: current
---

# Application architecture

Artisanal Software is an Express 5 application on Node 24. EJS templates
render the studio homepage, PodHaven marketing pages, and RSS podcast pages.
All pages use server-rendered HTML and CSS. Do not add client-side JavaScript.

## Request handling

`app.js` connects configuration, middleware, controllers, and templates.
`config/index.js` reads process environment variables. Helmet supplies security
headers, compression reduces responses, and the rate limiter bounds requests.
The app trusts the Cloudflare-to-Railway proxy chain. Review the actual proxy
configuration before changing client-IP or rate-limit behavior.

RSS routes validate input in `middleware/validateFeedUrl.js`, then use the
controllers and `services/rssParser.js` to fetch and parse a feed. EJS renders
the result. `services/urlHelper.js` builds web, custom-scheme, and Universal
Links. `services/htmlHelper.js` prepares description text for metadata.

## Public routes

| Route | Purpose |
| --- | --- |
| `/` | Artisanal Software studio homepage. |
| `/podhaven` | PodHaven feature overview. |
| `/podhaven/privacy` | PodHaven privacy information. |
| `/podhaven/<feature>` | Feature pages and screenshots. |
| `/podhaven/guides` and `/podhaven/guides/<guide>` | App guides. |
| `/podhaven/podcast?feedURL=...` | Podcast metadata and episode list. |
| `/podhaven/episode?feedURL=...&guid=...` | Episode details and audio player. |
| `/podhaven/open/podcast` and `/podhaven/open/episode` | App Store fallback for app-opening links. |
| `/.well-known/apple-app-site-association` | Apple's app-to-domain association JSON. |
| `/health` | Health response: HTTP 200 with `ok`. |
| `/public/...` | Static images and stylesheets. |

RSS routes return 400 for missing or invalid input and 500 for fetch or parse
errors. An episode missing from its feed returns 404. Episode links support
the optional `startTime` timestamp in seconds. Marketing copy and screenshot placements are
in [the content guide](podhaven-content.md). Link activation and device checks
are in [the Universal Links runbook](universal-links.md).

## Existing content decisions

These constraints predate the foundation adoption. Their original decision
dates are not recorded here.

- Render RSS `<content:encoded>` as trusted HTML with EJS's unescaped output.
  Escape plain `<description>` and other plain-text fallbacks. This preserves
  rich publisher content; it is an explicit trust boundary.
- Keep all interaction server-rendered. Use ordinary links, HTML controls,
  and CSS without client-side scripts.
- Use `assetUrl(...)` for reused static asset paths in templates. It appends
  a content hash so changed assets receive a new URL. The
  [cache incident](../memory/asset-cache-busting.md) explains why this matters.
- Preserve existing public feature, guide, podcast, and episode URLs when
  reorganizing content.

## Application layout

| Location | Responsibility |
| --- | --- |
| `app.js`, `config/` | Server composition and process configuration. |
| `controllers/`, `middleware/` | Requests, rendering, and input validation. |
| `services/` | RSS parsing, links, and HTML text handling. |
| `content/` | PodHaven feature copy, guides, privacy, and screenshots. |
| `views/` | EJS layouts, pages, and partials. |
| `public/` | Styles and images. |
| `test/` | Mocha application tests and local RSS fixtures. |
| `tests/`, `bin/` | Foundation tests and repository tools. |

There is no application build step. Railway runs `npm start`. See
[deployment](deployment.md) for service settings and verification.
