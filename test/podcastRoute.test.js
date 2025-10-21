const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const path = require('path');

describe('Podcast Route Integration Tests', function() {
  // Increase timeout for integration tests
  this.timeout(5000);

  describe('GET /podhaven/podcast', function() {
    it('should return 400 when feedURL is missing', async function() {
      const response = await request(app)
        .get('/podhaven/podcast')
        .expect(400);

      expect(response.text).to.include('Missing Feed URL');
    });

    it('should return 400 when feedURL is invalid', async function() {
      const response = await request(app)
        .get('/podhaven/podcast?feedURL=not-a-valid-url')
        .expect(400);

      expect(response.text).to.include('Invalid Feed URL');
    });

    it('should render podcast page with valid local feed', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/podcast')
        .query({ feedURL })
        .expect(200);

      // Check that response includes podcast content
      expect(response.text).to.include('The Daily');
      expect(response.text).to.include('Episodes');
      expect(response.text).to.include('Open in PodHaven');
    });

    it('should handle RSS feed parsing errors gracefully', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'malformed-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/podcast')
        .query({ feedURL })
        .expect(500);

      expect(response.text).to.include('Feed Error');
      expect(response.text).to.include('Unable to fetch or parse');
    });

    it('should include PodHaven share links in the response', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/podcast')
        .query({ feedURL })
        .expect(200);

      // Check for PodHaven links
      expect(response.text).to.include('podhaven://share?url=');
    });
  });

  describe('404 Handler', function() {
    it('should return 404 for non-existent routes', async function() {
      const response = await request(app)
        .get('/non-existent-page')
        .expect(404);

      expect(response.text).to.include('Page Not Found');
    });
  });
});
