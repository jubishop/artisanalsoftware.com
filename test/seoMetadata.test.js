const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const path = require('path');
const { parsePodcastFeed } = require('../services/rssParser');

describe('SEO and Social Media Metadata Tests', function() {
  this.timeout(5000);

  let validGuid;

  before(async function() {
    const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
    const feedURL = 'file://' + feedPath;
    const podcastData = await parsePodcastFeed(feedURL);
    validGuid = podcastData.episodes[0].guid;
  });

  describe('Podcast Page SEO Metadata', function() {
    it('should include Open Graph meta tags', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/podcast')
        .query({ feedURL })
        .expect(200);

      // Check for Open Graph tags
      expect(response.text).to.include('property="og:title"');
      expect(response.text).to.include('property="og:description"');
      expect(response.text).to.include('property="og:image"');
      expect(response.text).to.include('property="og:url"');
      expect(response.text).to.include('property="og:type"');
      expect(response.text).to.include('content="website"');
    });

    it('should include Twitter Card meta tags', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/podcast')
        .query({ feedURL })
        .expect(200);

      // Check for Twitter Card tags
      expect(response.text).to.include('name="twitter:card"');
      expect(response.text).to.include('content="summary_large_image"');
      expect(response.text).to.include('name="twitter:title"');
      expect(response.text).to.include('name="twitter:description"');
      expect(response.text).to.include('name="twitter:image"');
    });

    it('should include dynamic favicon from podcast image', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/podcast')
        .query({ feedURL })
        .expect(200);

      // Check for favicon
      expect(response.text).to.include('rel="icon"');
      expect(response.text).to.include('rel="apple-touch-icon"');
    });

    it('should include SEO meta description', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/podcast')
        .query({ feedURL })
        .expect(200);

      // Check for meta description
      expect(response.text).to.include('name="description"');
    });

    it('should strip HTML tags from meta descriptions', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/podcast')
        .query({ feedURL })
        .expect(200);

      // Meta descriptions should not contain HTML tags
      const descriptionMatch = response.text.match(/name="description" content="([^"]+)"/);
      if (descriptionMatch) {
        expect(descriptionMatch[1]).to.not.include('<');
        expect(descriptionMatch[1]).to.not.include('>');
      }
    });
  });

  describe('Episode Page SEO Metadata', function() {
    it('should include Open Graph meta tags', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      // Check for Open Graph tags
      expect(response.text).to.include('property="og:title"');
      expect(response.text).to.include('property="og:description"');
      expect(response.text).to.include('property="og:image"');
      expect(response.text).to.include('property="og:url"');
      expect(response.text).to.include('property="og:type"');
      expect(response.text).to.include('content="article"');
    });

    it('should include Twitter Card meta tags', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      // Check for Twitter Card tags
      expect(response.text).to.include('name="twitter:card"');
      expect(response.text).to.include('content="summary_large_image"');
      expect(response.text).to.include('name="twitter:title"');
      expect(response.text).to.include('name="twitter:description"');
      expect(response.text).to.include('name="twitter:image"');
    });

    it('should include dynamic favicon from episode/podcast image', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      // Check for favicon
      expect(response.text).to.include('rel="icon"');
      expect(response.text).to.include('rel="apple-touch-icon"');
    });

    it('should include podcast title in page title', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      // Episode page title should include podcast title
      expect(response.text).to.include('The Daily');
    });

    it('should include og:audio for episodes with audio URLs', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      // Check for og:audio if episode has audio
      expect(response.text).to.include('property="og:audio"');
    });
  });

  describe('Error Page Metadata', function() {
    it('should include noindex meta tag on error pages', async function() {
      const response = await request(app)
        .get('/podhaven/podcast')
        .expect(400);

      // Error pages should not be indexed
      expect(response.text).to.include('name="robots"');
      expect(response.text).to.include('noindex');
    });
  });

  describe('Content-Type Headers', function() {
    it('should return text/html content type for podcast pages', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/podcast')
        .query({ feedURL })
        .expect(200);

      expect(response.headers['content-type']).to.include('text/html');
    });

    it('should return text/html content type for episode pages', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      expect(response.headers['content-type']).to.include('text/html');
    });
  });
});
