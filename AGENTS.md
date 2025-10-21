# AI Agent Guide - Podcast Server

This document helps AI agents understand and work with this codebase effectively.

## 🎯 Project Overview

**What**: Node.js Express server that renders podcast information from RSS feeds with PodHaven iOS app integration.

**Purpose**: Display podcast/episode pages server-side with deep links to the PodHaven mobile app.

**Key Constraint**: Server-side rendering only - NO client-side JavaScript.

## 📁 Codebase Structure

```
artisanalsoftware.com/
├── app.js                    # Express app entry point
├── controllers/              # Route handlers
│   ├── podcastController.js  # GET /podhaven/podcast
│   └── episodeController.js  # GET /podhaven/episode
├── services/                 # Business logic
│   ├── rssParser.js         # RSS feed fetching/parsing
│   └── urlHelper.js         # PodHaven link generation
├── views/                    # EJS templates
│   ├── podcast.ejs          # Podcast page
│   ├── episode.ejs          # Episode page
│   └── error.ejs            # Error pages
├── public/css/
│   └── styles.css           # Mobile-first responsive CSS
├── test/                     # Test files
│   ├── fixtures/            # Sample RSS feeds (no network in tests!)
│   ├── *.test.js            # All tests use local fixtures
└── spec/                     # Requirements & design docs
    ├── requirements.md       # USER STORIES - read this first!
    ├── design.md            # Architecture decisions
    └── tasks.md             # Implementation checklist
```

## 🔑 Key Architectural Decisions

### 1. **Trusted RSS Content Model**
- RSS feed content from `<content:encoded>` is rendered as HTML (unescaped `<%-` in EJS)
- This is BY DESIGN - RSS feeds are treated as trusted sources
- Plain text descriptions from `<description>` are escaped normally

**Why**: Podcast descriptions often contain rich HTML formatting. Users provide feed URLs at their own risk.

### 2. **No Client-Side JavaScript**
- All rendering happens server-side
- Pure HTML/CSS output
- No React, Vue, or frontend frameworks

**Why**: Simplicity, performance, SEO, and design requirement.

### 3. **Mobile-First CSS**
- Base styles target mobile (default)
- Progressive enhancement via media queries (@768px, @1024px, @1440px)
- Touch targets minimum 48px

### 4. **Image Fallback Pattern**
- Episode images fall back to podcast images
- Used in: rssParser.js, episodeController.js, episode.ejs
- Pattern: `episodeImageUrl || podcastImageUrl`

### 5. **Error Handling Pattern**
```javascript
// 400 - Bad Request: Missing/invalid parameters
// 404 - Not Found: Episode GUID not found
// 500 - Internal Error: RSS feed issues, parsing errors
```

## 🧪 Testing Philosophy

**CRITICAL**: All tests use LOCAL fixtures from `test/fixtures/`

```javascript
// ✅ CORRECT - Uses local file
const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
const feedURL = 'file://' + feedPath;

// ❌ WRONG - Makes network requests
const feedURL = 'https://example.com/feed.xml';
```

**Why**: Tests must run offline, be fast, and not depend on external services.

### Test Files
- `rssParser.test.js` - RSS parsing logic
- `urlHelper.test.js` - URL generation
- `podcastRoute.test.js` - Podcast page integration
- `episodeRoute.test.js` - Episode page integration
- `seoMetadata.test.js` - SEO/social media metadata

**Run tests**: `npm test`

Expected: **45 passing** (no failures allowed)

## 🛠️ Common Tasks

### Adding a New Field to Podcast Pages

1. **Parse it in rssParser.js**:
   ```javascript
   // Add to customFields in parser config
   customFields: {
     feed: [['itunes:category', 'category']]
   }

   // Add to podcastData object
   category: feed.category || 'Uncategorized'
   ```

2. **Pass it in podcastController.js**:
   ```javascript
   res.render('podcast', {
     podcast: podcastData,  // Already includes new field
     // ...
   });
   ```

3. **Display it in podcast.ejs**:
   ```html
   <p class="podcast-category"><%= podcast.category %></p>
   ```

4. **Style it in styles.css**:
   ```css
   .podcast-category {
     color: #666;
   }
   ```

5. **Add tests**:
   ```javascript
   expect(podcastData).to.have.property('category');
   ```

### Adding a New Route

1. Create controller in `controllers/`
2. Add route in `app.js` (before 404 handler!)
3. Create EJS template in `views/`
4. Add integration tests
5. Update this guide

### Modifying CSS

- **Start with mobile** (base styles)
- **Add tablet** (@media min-width: 768px)
- **Add desktop** (@media min-width: 1024px)
- **Add large** (@media min-width: 1440px)
- Test responsive behavior manually

## ⚠️ Important Gotchas

### 1. **RSS Parser Custom Fields**
The rss-parser library needs explicit field mapping:

```javascript
customFields: {
  feed: [['itunes:author', 'itunesAuthor']],  // Maps XML to JS property
  item: [['itunes:duration', 'duration']]
}
```

Without this, fields are not extracted!

### 2. **EJS Escaping**
- `<%= value %>` - Escaped (safe, default)
- `<%- value %>` - Unescaped (only for trusted HTML like content:encoded)

### 3. **File:// URL Support**
`rssParser.js` supports `file://` URLs for testing. Don't remove this!

```javascript
if (url.protocol === 'file:') {
  return await fs.readFile(filePath, 'utf-8');
}
```

### 4. **Meta Description HTML Stripping**
Meta tags strip HTML but preserve the content:

```javascript
<%= podcast.description.replace(/<[^>]*>/g, '').substring(0, 160) %>
```

This pattern is used in podcast.ejs and episode.ejs for SEO.

### 5. **PodHaven Link Format**
**Must** be double-encoded:

```javascript
// ✅ CORRECT
podhaven://share?url=https%3A%2F%2Fartisanalsoftware.com%2Fpodhaven%2Fpodcast%3FfeedURL%3D...

// ❌ WRONG
podhaven://share?url=https://artisanalsoftware.com/podhaven/podcast?feedURL=...
```

The `urlHelper.js` handles this correctly.

### 6. **Route Order Matters**
In `app.js`, routes must be defined BEFORE the 404 handler:

```javascript
// ✅ Routes first
app.get('/podhaven/podcast', podcastController.showPodcast);
app.get('/podhaven/episode', episodeController.showEpisode);

// ❌ 404 handler after routes
app.use((req, res) => { ... });
```

## 🔍 Debugging Tips

### RSS Feed Issues
1. Check `test/fixtures/` for examples of working feeds
2. Look at `rssParser.js` customFields configuration
3. RSS parser outputs are logged in tests - use `console.log(podcastData)`

### Template Rendering Issues
1. Check controller is passing correct data: `console.log('Rendering with:', { podcast, episodes })`
2. Verify EJS syntax: `<%=` for escaped, `<%-` for raw HTML
3. Check for undefined values: `<% if (value) { %>`

### CSS Not Applying
1. Clear browser cache
2. Check browser DevTools for 404s on `/public/css/styles.css`
3. Verify Express static middleware: `app.use('/public', express.static(...))`

### Tests Failing
1. Run single test file: `npx mocha test/rssParser.test.js`
2. Check if using network instead of fixtures
3. Verify test fixture files exist in `test/fixtures/`

## 📚 Where to Find Information

### Requirements & Specs
- **spec/requirements.md** - USER STORIES (read first!)
- **spec/design.md** - Architecture decisions
- **spec/tasks.md** - Implementation plan (completed)

### Code Documentation
- **REVIEW.md** - Code review and analysis
- **README.md** - User-facing documentation
- **This file (AGENTS.md)** - AI agent guide

### Implementation Details
- Controller validation patterns: `controllers/podcastController.js:13-27`
- RSS parsing logic: `services/rssParser.js:66-135`
- PodHaven link generation: `services/urlHelper.js`
- Error handling: `app.js:36-47`

## 🎨 Code Style Guidelines

### JavaScript
- Use `const` by default, `let` when reassignment needed
- No semicolons at line ends (project convention)
- Single quotes for strings
- Descriptive variable names: `podcastData`, not `data`

### EJS Templates
- Indent with 2 spaces
- Comments: `<!-- Comment -->`
- Conditional rendering: `<% if (condition) { %> ... <% } %>`
- Always escape user content except `content:encoded`

### CSS
- Mobile-first approach
- BEM-like class naming: `.podcast-header`, `.episode-title`
- Comments for major sections: `/* ===== Buttons ===== */`
- Group media queries by breakpoint

### Testing
- Descriptive test names: `should return 400 when feedURL is missing`
- Use fixtures, never network requests
- Test both success and error cases
- Keep tests focused (one assertion per test when possible)

## 🚀 Quick Start for New Agents

1. **Read the specs first**:
   ```bash
   cat spec/requirements.md
   cat spec/design.md
   ```

2. **Understand the structure**:
   ```bash
   ls -R controllers/ services/ views/
   ```

3. **Run the tests**:
   ```bash
   npm test
   ```

4. **Start the server**:
   ```bash
   npm start
   # Visit http://localhost:3000/podhaven/podcast?feedURL=<url>
   ```

5. **Review existing implementations** for patterns:
   - Controllers for validation patterns
   - Services for business logic
   - Templates for rendering patterns

## 🔄 Workflow for Changes

### Adding Features
1. Check if it's in requirements (spec/requirements.md)
2. Review design decisions (spec/design.md)
3. Write tests first (TDD approach)
4. Implement feature
5. Update documentation
6. Run full test suite (`npm test`)

### Fixing Bugs
1. Write a failing test that reproduces the bug
2. Fix the bug
3. Verify test passes
4. Check for similar issues elsewhere
5. Run full test suite

### Refactoring
1. Ensure all tests pass before starting
2. Make small, incremental changes
3. Run tests after each change
4. Don't change behavior, only structure
5. Update documentation if patterns change

## 🎯 Success Criteria

Before completing any task:
- [ ] All 45 tests passing
- [ ] No new linting errors
- [ ] Mobile-first responsive design maintained
- [ ] No client-side JavaScript added
- [ ] Error handling follows existing patterns
- [ ] Documentation updated if needed
- [ ] SEO metadata still present

## 🆘 When Things Go Wrong

### "Tests are failing"
- Check if using network instead of fixtures
- Verify fixture files exist
- Look at error messages carefully
- Run individual test files to isolate

### "Page won't render"
- Check app.js route order
- Verify controller is passing data to template
- Look at EJS syntax errors
- Check for undefined variables in templates

### "RSS feed won't parse"
- Test with sample fixtures first
- Check customFields configuration
- Verify feed URL is valid
- Check timeout settings (RSS_TIMEOUT)

### "CSS not working"
- Clear browser cache
- Check static file middleware
- Verify CSS file path
- Test in mobile/desktop views

## 💡 Remember

- **Server-side only** - No client JavaScript
- **Mobile-first** - Start with small screens
- **Trust RSS** - content:encoded is unescaped
- **Test locally** - Use fixtures, not network
- **45 tests** - All must pass
- **Read specs** - Requirements are gospel

Good luck! The codebase is well-tested and structured. When in doubt, look at existing implementations for patterns.
