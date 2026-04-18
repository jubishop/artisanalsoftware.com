const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const path = require('path');
const { parsePodcastFeed } = require('../services/rssParser');

describe('Episode Route Integration Tests', function() {
  // Increase timeout for integration tests
  this.timeout(5000);

  let validGuid;

  // Get a valid GUID from the sample feed before running tests
  before(async function() {
    const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
    const feedURL = 'file://' + feedPath;
    const podcastData = await parsePodcastFeed(feedURL);
    validGuid = podcastData.episodes[0].guid;
  });

  describe('GET /podhaven/episode', function() {
    it('should return 400 when feedURL is missing', async function() {
      const response = await request(app)
        .get('/podhaven/episode')
        .query({ guid: 'some-guid' })
        .expect(400);

      expect(response.text).to.include('Missing Feed URL');
    });

    it('should return 400 when guid is missing', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL })
        .expect(400);

      expect(response.text).to.include('Missing Episode GUID');
    });

    it('should return 400 when feedURL is invalid', async function() {
      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL: 'not-a-valid-url', guid: 'some-guid' })
        .expect(400);

      expect(response.text).to.include('Invalid Feed URL');
    });

    it('should return 404 when episode GUID is not found', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: 'non-existent-guid-12345' })
        .expect(404);

      expect(response.text).to.include('Episode Not Found');
    });

    it('should render episode page with valid feed and GUID', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      // Check that response includes episode content
      expect(response.text).to.include('Episode Description');
      expect(response.text).to.include('Open in PodHaven');
      expect(response.text).to.include('View Podcast');
    });

    it('should include audio player in the response', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      // Check for audio element
      expect(response.text).to.include('<audio');
    });

    it('should include PodHaven share link', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      // Check for PodHaven link
      expect(response.text).to.include('podhaven://share?url=');
    });

    it('should include link back to podcast page', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      // Check for link to podcast page
      expect(response.text).to.include('/podhaven/podcast');
      expect(response.text).to.include('The Daily'); // Podcast title
    });

    it('should handle malformed feeds gracefully', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'malformed-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: 'some-guid' })
        .expect(500);

      expect(response.text).to.include('Feed Error');
    });

    it('should include timestamp in audio player when startTime parameter is provided', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid, startTime: '90' })
        .expect(200);

      // Check for media fragment in audio source
      expect(response.text).to.include('#t=90');
    });

    it('should include timestamp in og:url when startTime parameter is provided', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid, startTime: '90' })
        .expect(200);

      // Check for timestamp in og:url meta tag
      expect(response.text).to.include('og:url');
      expect(response.text).to.include('&amp;startTime=90');
    });

    it('should include timestamp in PodHaven share link when startTime parameter is provided', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid, startTime: '90' })
        .expect(200);

      // Check for timestamp in PodHaven link (will be encoded)
      expect(response.text).to.include('podhaven://share?url=');
      // The startTime=90 will be encoded in the URL
      expect(response.text).to.match(/podhaven:\/\/share\?url=.*startTime%3D90/);
    });

    it('should include formatted timestamp in page title when startTime is provided', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid, startTime: '90' })
        .expect(200);

      const titleMatch = response.text.match(/<title>([^<]*)<\/title>/);
      expect(titleMatch, 'expected <title> tag in response').to.not.be.null;
      expect(titleMatch[1]).to.include('@ 1:30');
    });

    it('should include formatted timestamp in og:title and twitter:title when startTime is provided', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid, startTime: '3725' })
        .expect(200);

      expect(response.text).to.match(/property="og:title" content="[^"]*@ 1:02:05"/);
      expect(response.text).to.match(/name="twitter:title" content="[^"]*@ 1:02:05"/);
    });

    it('should omit timestamp from titles when startTime is not provided', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid })
        .expect(200);

      const titleMatch = response.text.match(/<title>([^<]*)<\/title>/);
      expect(titleMatch[1]).to.not.include('@');
      expect(response.text).to.not.match(/property="og:title" content="[^"]*@ \d/);
      expect(response.text).to.not.match(/name="twitter:title" content="[^"]*@ \d/);
    });

    it('should omit timestamp from titles when startTime is zero', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid, startTime: '0' })
        .expect(200);

      const titleMatch = response.text.match(/<title>([^<]*)<\/title>/);
      expect(titleMatch[1]).to.not.include('@');
    });

    it('should omit timestamp from titles when startTime is invalid', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid, startTime: 'invalid' })
        .expect(200);

      const titleMatch = response.text.match(/<title>([^<]*)<\/title>/);
      expect(titleMatch[1]).to.not.include('@');
    });

    it('should ignore invalid startTime parameter', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const response = await request(app)
        .get('/podhaven/episode')
        .query({ feedURL, guid: validGuid, startTime: 'invalid' })
        .expect(200);

      // Should render page without timestamp in audio
      expect(response.text).to.include('<audio');
      expect(response.text).to.not.include('#t=invalid');
    });
  });
});
