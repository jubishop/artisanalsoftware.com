
# Implementation Plan

- [-] 1. Set up project structure and dependencies
  - Initialize Node.js project with package.json
  - Install Express, EJS template engine, RSS parsing library, and testing dependencies
  - Create directory structure: controllers/, services/, views/, public/css/, test/fixtures/
  - Download and store sample RSS feeds in test/fixtures/ for testing (valid feeds, malformed feeds, feeds with missing data)
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [ ] 2. Implement RSS parser service
  - Create RSS parser service to fetch and parse podcast feeds
  - Extract podcast metadata (title, description, author, imageUrl, link)
  - Parse episode data (guid, title, description, imageUrl, pubDate, duration)
  - Prioritize content:encoded for HTML descriptions, fallback to description for plain text
  - Handle network timeouts and parsing errors gracefully
  - _Requirements: 1.2, 2.2, 3.4, 1.5, 2.5_

- [ ] 3. Create URL helper service
  - Implement PodHaven link generation for podcasts and episodes
  - Generate podcast share links: podhaven://share?url=https://artisanalsoftware.com/podhaven/podcast?feedURL=<feedURL>
  - Generate episode share links: podhaven://share?url=https://artisanalsoftware.com/podhaven/episode?feedURL=<feedURL>&guid=<guid>
  - Handle proper URL encoding for all parameters
  - _Requirements: 5.1, 5.2, 5.5_

- [ ] 4. Implement podcast page controller and route
  - Create GET /podhaven/podcast route with feedURL parameter validation
  - Implement controller to fetch RSS data and render podcast page
  - Handle missing or invalid feedURL parameters (400 error)
  - Handle RSS fetch/parse failures (500 error)
  - Pass podcast data and PodHaven links to template
  - _Requirements: 1.1, 1.3, 1.4, 3.3_

- [ ] 5. Implement episode page controller and route
  - Create GET /podhaven/episode route with feedURL and guid parameter validation
  - Implement controller to fetch RSS data and find specific episode
  - Handle missing parameters (400 error) and episode not found (404 error)
  - Generate episode PodHaven link and podcast page link (integrated as podcast title)
  - Pass episode data to template with image fallback logic
  - _Requirements: 2.1, 2.3, 2.4, 5.4_

- [ ] 6. Create podcast page template with responsive design
  - Build EJS template for podcast pages with mobile-first CSS
  - Display podcast title, description (HTML or plain text), author, and image
  - Show podcast website link and PodHaven share link
  - Render episode list with titles, publication dates, and individual PodHaven links
  - Include rich metadata (Open Graph, Twitter Cards) with podcast image as favicon
  - _Requirements: 1.2, 4.2, 4.4, 5.3, 5.4_

- [ ] 7. Create episode page template with responsive design
  - Build EJS template for episode pages with mobile-first CSS
  - Display episode title, description (HTML or plain text), and image (fallback to podcast image)
  - Show publication date, duration, and PodHaven share link
  - Include podcast title as clickable link back to podcast page
  - Include rich metadata (Open Graph, Twitter Cards) with episode/podcast image as favicon
  - _Requirements: 2.5, 4.2, 4.4, 5.4_

- [ ] 8. Implement error handling and error pages
  - Create error handling middleware for unhandled errors
  - Build error page template with consistent styling
  - Implement parameter validation with appropriate error responses
  - Add request logging with timestamps and parameters
  - Sanitize error messages to prevent information leakage
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 9. Create responsive CSS styles
  - Develop mobile-first CSS with media queries for desktop
  - Implement single-column mobile layout with touch-optimized elements
  - Create multi-column desktop layout with enhanced typography
  - Style podcast and episode pages consistently
  - Optimize image display for different screen sizes
  - _Requirements: 4.2, 4.4_

- [ ] 10. Add SEO and social media metadata
  - Implement dynamic page titles (podcast/episode titles)
  - Add Open Graph and Twitter Card metadata to all templates
  - Set up dynamic favicons using podcast/episode images
  - Include proper viewport and responsive meta tags
  - Ensure proper Content-Type headers for all responses
  - _Requirements: 4.1, 4.3_

- [ ] 11. Write unit tests for core services
  - Test RSS parser using local RSS feed fixtures from test/fixtures/
  - Test URL helper PodHaven link generation with sample data
  - Test error handling scenarios with malformed fixture files
  - Mock network requests to prevent actual HTTP calls during testing
  - _Requirements: 1.2, 2.2, 3.2_

- [ ] 12. Write integration tests for routes
  - Test podcast and episode page rendering using local RSS feed fixtures
  - Test error responses for invalid parameters using test data
  - Test timeout handling and malformed feeds using fixture files
  - Ensure no network requests are made during test execution
  - _Requirements: 1.1, 2.1, 3.4_