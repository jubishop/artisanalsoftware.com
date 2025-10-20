# Design Document

## Overview

The Podcast Server is a Node.js Express application that renders server-side HTML pages for podcast content. It fetches and parses RSS feeds to display podcast information and individual episode details with integrated PodHaven iOS app links.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │───▶│  Express Server │───▶│   RSS Feeds     │
│                 │◀───│                 │◀───│   (External)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  HTML Templates │
                       │   & CSS Styles  │
                       └─────────────────┘
```

### Request Flow

1. User requests `/podhaven/podcast?feedURL=...` or `/podhaven/episode?feedURL=...&guid=...`
2. Express server validates parameters
3. Server fetches RSS feed from external URL
4. RSS parser extracts relevant data
5. Data is passed to HTML template engine
6. Rendered HTML with CSS is returned to browser

## Components and Interfaces

### Core Components

#### 1. Express Application (`app.js`)
- Main application entry point
- Route definitions and middleware setup
- Error handling middleware
- Static file serving for CSS

#### 2. RSS Parser Service (`services/rssParser.js`)
- Fetches RSS feeds from URLs with timeout handling
- Parses XML content into structured data
- Extracts podcast metadata and episode information
- Prioritizes `<content:encoded>` for descriptions (HTML), falls back to `<description>` (plain text)
- Handles parsing errors gracefully

#### 3. Route Controllers (`controllers/`)
- `podcastController.js`: Handles podcast page requests
- `episodeController.js`: Handles episode page requests
- Parameter validation and error responses

#### 4. Template Engine Integration
- Uses EJS or Handlebars for server-side rendering
- Podcast page template (`views/podcast.ejs`) - renders responsive HTML/CSS with rich metadata
- Episode page template (`views/episode.ejs`) - renders responsive HTML/CSS with rich metadata
- Error page template (`views/error.ejs`) - renders responsive HTML/CSS
- Templates include mobile-specific CSS classes and viewport meta tags
- Rich social media metadata (Open Graph, Twitter Cards) for link previews
- Dynamic favicon using podcast/episode images
- No client-side JavaScript - all content rendered server-side

#### 5. URL Helper Service (`services/urlHelper.js`)
- Generates PodHaven app links with proper URL encoding
- Podcast links: `podhaven://share?url=https://artisanalsoftware.com/podhaven/podcast?feedURL=<feedURL>`
- Episode links: `podhaven://share?url=https://artisanalsoftware.com/podhaven/episode?feedURL=<feedURL>&guid=<guid>`
- URL encoding and validation utilities

### Interface Definitions

#### RSS Parser Interface
```javascript
interface PodcastData {
  title: string;
  description: string;
  descriptionHtml?: string; // from content:encoded
  author: string;
  imageUrl: string;
  link?: string;
  episodes: Episode[];
}

interface Episode {
  guid: string;
  title: string;
  description: string;
  descriptionHtml?: string; // from content:encoded
  imageUrl?: string;
  pubDate: Date;
  duration?: string;
}
```

#### Template Data Flow
Controllers pass parsed RSS data directly to EJS/Handlebars templates for server-side HTML generation. No client-side JavaScript is used - all rendering happens on the server before sending HTML to the browser.

## Data Models

### Podcast Model
- **title**: Podcast name from RSS `<title>`
- **description**: Podcast description from RSS `<description>` (plain text fallback)
- **descriptionHtml**: Rich HTML description from RSS `<content:encoded>` (preferred)
- **author**: Creator information from RSS `<itunes:author>`
- **imageUrl**: Podcast artwork from RSS `<itunes:image>` or `<image>` (required)
- **link**: Podcast website from RSS `<link>`
- **episodes**: Array of episode objects

### Episode Model
- **guid**: Unique identifier from RSS `<guid>`
- **title**: Episode title from RSS `<title>`
- **description**: Episode description from RSS `<description>` (plain text fallback)
- **descriptionHtml**: Rich HTML description from RSS `<content:encoded>` (preferred)
- **imageUrl**: Episode artwork (fallback to podcast imageUrl if episode has no image)
- **pubDate**: Publication date from RSS `<pubDate>`
- **duration**: Episode length from RSS `<itunes:duration>`

### PodHaven Link Model
- **podcastLink**: `podhaven://share?url=${encodeURIComponent('https://artisanalsoftware.com/podhaven/podcast?feedURL=' + feedURL)}`
- **episodeLink**: `podhaven://share?url=${encodeURIComponent('https://artisanalsoftware.com/podhaven/episode?feedURL=' + feedURL + '&guid=' + guid)}`

## Error Handling

### Error Types and Responses

#### 1. Parameter Validation Errors (400)
- Missing feedURL parameter
- Invalid URL format
- Missing guid parameter for episodes

#### 2. RSS Feed Errors (500)
- Network timeout (10 second limit)
- Invalid XML format
- Feed parsing failures
- HTTP errors from feed source

#### 3. Episode Not Found (404)
- GUID not found in RSS feed
- Empty or invalid episode data

### Error Page Structure
- Consistent HTML error pages with proper status codes
- User-friendly error messages
- Navigation back to main functionality
- Proper CSS styling matching main pages

## Testing Strategy

### Unit Testing
- RSS parser service with mock XML data
- URL helper functions for PodHaven link generation
- Controller parameter validation logic

### Integration Testing
- End-to-end page rendering with real RSS feeds
- Error handling with invalid feeds and parameters
- Template rendering with various data scenarios

### Performance Testing
- RSS feed fetch timeout handling
- Large feed parsing performance
- Concurrent request handling

## SEO and Social Media Integration

### HTML Head Metadata

#### Podcast Pages
- `<title>`: Podcast title
- `<link rel="icon">`: Podcast imageUrl as favicon
- `<meta name="description">`: Podcast description (truncated for SEO)
- Open Graph tags:
  - `og:title`: Podcast title
  - `og:description`: Podcast description
  - `og:image`: Podcast imageUrl
  - `og:url`: Current page URL
  - `og:type`: "website"
- Twitter Card tags:
  - `twitter:card`: "summary_large_image"
  - `twitter:title`: Podcast title
  - `twitter:description`: Podcast description
  - `twitter:image`: Podcast imageUrl

#### Episode Pages
- `<title>`: Episode title
- `<link rel="icon">`: Episode imageUrl (fallback to podcast imageUrl)
- `<meta name="description">`: Episode description (truncated for SEO)
- Open Graph tags:
  - `og:title`: Episode title
  - `og:description`: Episode description
  - `og:image`: Episode imageUrl (fallback to podcast imageUrl)
  - `og:url`: Current page URL
  - `og:type`: "article"

- Twitter Card tags:
  - `twitter:card`: "summary_large_image"
  - `twitter:title`: Episode title
  - `twitter:description`: Episode description
  - `twitter:image`: Episode imageUrl (fallback to podcast imageUrl)

### Image Fallback Logic
- Episode pages: Use episode imageUrl if available, otherwise use podcast imageUrl
- Ensure all images are properly sized for social media previews
- Handle missing images gracefully with default placeholder

## Security Considerations

### Input Validation
- URL parameter sanitization
- RSS feed URL validation
- XSS prevention in rendered content
- HTML content from `<content:encoded>` rendered directly (trusted RSS source)
- Plain text descriptions properly escaped when rendered

### Error Information Disclosure
- Generic error messages for external users
- Detailed logging for debugging (server-side only)
- No sensitive information in client responses

## Deployment and Configuration

### Environment Variables
- `PORT`: Server port (default: 3000)
- `RSS_TIMEOUT`: Feed fetch timeout in milliseconds (default: 10000)
- `NODE_ENV`: Environment setting for error handling

### Static Assets
- CSS files served from `/public/css/`
- Responsive design with different layouts for mobile and desktop
- Mobile-first CSS approach with media queries for desktop
- Consistent styling across all pages
- No JavaScript files - pure HTML/CSS output only

### Mobile vs Desktop Design

#### Mobile Layout
- Single column layout optimized for touch interaction
- Larger touch targets for PodHaven app links
- Simplified navigation and reduced visual clutter
- Episode lists with condensed information display
- Optimized image sizes for mobile bandwidth

#### Desktop Layout  
- Multi-column layout with sidebar for episode navigation
- Larger images and more detailed episode information
- Enhanced typography and spacing
- Side-by-side content arrangement where appropriate
- Full-size podcast artwork display

### Performance Optimizations
- RSS feed caching (optional future enhancement)
- Gzip compression for responses
- Efficient XML parsing with streaming where possible