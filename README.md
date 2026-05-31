# Podcast Server

A Node.js Express server that renders server-side HTML pages for podcast content from RSS feeds, with integrated PodHaven iOS app deep links.

## Features

- 📻 Display podcast information from any RSS feed
- 🎧 Individual episode pages with audio players
- 📱 Mobile-first responsive design
- 🔗 PodHaven iOS app deep link integration
- 🎨 Rich social media metadata (Open Graph, Twitter Cards)
- ⚡ Server-side rendering (no client-side JavaScript)
- 🧪 Comprehensive test coverage (45 tests)

## Quick Start

### Installation

```bash
npm install
```

### Run the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### Run Tests

```bash
npm test
```

## Usage

### View a Podcast

```
GET /podhaven/podcast?feedURL=<RSS_FEED_URL>
```

Example:
```
http://localhost:3000/podhaven/podcast?feedURL=https://feeds.example.com/podcast.xml
```

### View an Episode

```
GET /podhaven/episode?feedURL=<RSS_FEED_URL>&guid=<EPISODE_GUID>
```

Example:
```
http://localhost:3000/podhaven/episode?feedURL=https://feeds.example.com/podcast.xml&guid=episode-123
```

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
PORT=3000                  # Server port (default: 3000)
RSS_TIMEOUT=10000         # RSS feed fetch timeout in ms (default: 10000)
NODE_ENV=production       # Environment mode (development/production)
```

## Project Structure

```
artisanalsoftware.com/
├── app.js                    # Express application entry point
├── controllers/              # Route controllers
│   ├── podcastController.js  # Podcast page logic
│   └── episodeController.js  # Episode page logic
├── services/                 # Business logic
│   ├── rssParser.js         # RSS feed parsing
│   └── urlHelper.js         # URL generation utilities
├── views/                    # EJS templates
│   ├── podcast.ejs          # Podcast page template
│   ├── episode.ejs          # Episode page template
│   └── error.ejs            # Error page template
├── public/                   # Static assets
│   └── css/
│       └── styles.css       # Responsive styles
├── test/                     # Test files
│   ├── fixtures/            # Sample RSS feeds
│   ├── rssParser.test.js
│   ├── urlHelper.test.js
│   ├── podcastRoute.test.js
│   ├── episodeRoute.test.js
│   └── seoMetadata.test.js
└── spec/                     # Documentation
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

## API Endpoints

### GET /podhaven/podcast

Displays podcast information with episode list.

**Query Parameters:**
- `feedURL` (required): URL of the podcast RSS feed

**Response:**
- `200 OK`: HTML page with podcast information
- `400 Bad Request`: Missing or invalid feedURL
- `500 Internal Server Error`: RSS feed fetch/parse error

### GET /podhaven/episode

Displays individual episode details.

**Query Parameters:**
- `feedURL` (required): URL of the podcast RSS feed
- `guid` (required): Episode GUID from the RSS feed

**Response:**
- `200 OK`: HTML page with episode details
- `400 Bad Request`: Missing feedURL or guid
- `404 Not Found`: Episode GUID not found in feed
- `500 Internal Server Error`: RSS feed fetch/parse error

## Features in Detail

### RSS Feed Parsing

- Supports standard RSS 2.0 podcast feeds
- Extracts: title, description, author, artwork, episodes
- Prioritizes `content:encoded` for rich HTML descriptions
- Falls back to `description` or `itunes:summary` for plain text
- Handles network timeouts (configurable via `RSS_TIMEOUT`)

### PodHaven Deep Links

Generates deep links in the format:
```
podhaven://share?url=https://artisanalsoftware.com/podhaven/podcast?feedURL=...
```

These links allow users to open content directly in the PodHaven iOS app.

### Responsive Design

- Mobile-first CSS approach
- Breakpoints: 768px (tablet), 1024px (desktop), 1440px (large desktop)
- Touch-friendly buttons (48px minimum tap targets)
- Optimized for both portrait and landscape orientations

### SEO & Social Media

Every page includes:
- Open Graph meta tags for Facebook/LinkedIn
- Twitter Card meta tags
- Dynamic favicons using podcast/episode artwork
- Semantic HTML structure
- Descriptive page titles

## Testing

The project includes comprehensive test coverage:

- **Unit Tests**: RSS parser, URL helper (17 tests)
- **Integration Tests**: Routes, error handling (15 tests)
- **SEO Tests**: Metadata validation (13 tests)

All tests use local fixtures (no network calls during testing).

## Error Handling

The server handles errors gracefully:

- **400 Bad Request**: Invalid input parameters
- **404 Not Found**: Episode GUID not found
- **500 Internal Server Error**: RSS feed issues
- Request logging with timestamps
- Different error messages for development/production

## Dependencies

### Production
- `express` (v5.1.0): Web framework
- `ejs` (v3.1.10): Template engine
- `rss-parser` (v3.13.0): RSS feed parsing

### Development
- `mocha` (v11.7.4): Test framework
- `chai` (v6.2.0): Assertion library
- `supertest` (v7.1.4): HTTP testing

## Performance Considerations

- Server-side rendering (no client-side JavaScript)
- Efficient RSS parsing with streaming
- Static asset serving
- Configurable timeouts

### Future Enhancements
- RSS feed caching
- Pagination for large episode lists

## Deployment

Hosted on **Railway** with DNS in **Cloudflare**. Pushes to `main` auto-deploy.

For CLI setup, env vars, domains, and troubleshooting, see [AGENTS.md — Railway](AGENTS.md#railway).

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile Safari (iOS)
- Android Chrome
- Responsive design works on all screen sizes

## License

ISC

## Support

For issues or questions, please file an issue at:
https://github.com/jubishop/artisanalsoftware.com/issues
