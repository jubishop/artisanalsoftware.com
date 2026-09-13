const { expect } = require('chai');
const { parsePodcastFeed, findEpisodeByGuid } = require('../services/rssParser');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { pathToFileURL } = require('url');

describe('RSS Parser Service', function() {
  // Increase timeout for RSS parsing
  this.timeout(5000);

  describe('parsePodcastFeed', function() {
    it('should parse encoded fixture paths in worktrees with spaces', async function() {
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'podhaven worktree '));
      try {
        const feedPath = path.join(directory, 'episode #1 100% café.xml');
        fs.copyFileSync(path.join(__dirname, 'fixtures', 'sample-valid-feed.xml'), feedPath);
        const podcastData = await parsePodcastFeed(pathToFileURL(feedPath).href);
        expect(podcastData.title).to.equal('The Daily');
        expect(podcastData.episodes.length).to.be.greaterThan(0);
      } finally {
        fs.rmSync(directory, { recursive: true, force: true });
      }
    });

    it('should parse a valid RSS feed from file', async function() {
      // Use file:// URL for local testing
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const podcastData = await parsePodcastFeed(feedURL);

      // Verify podcast metadata
      expect(podcastData).to.have.property('title');
      expect(podcastData.title).to.be.a('string');
      expect(podcastData).to.have.property('description');
      expect(podcastData).to.have.property('author');
      expect(podcastData).to.have.property('imageUrl');
      expect(podcastData).to.have.property('episodes');
      expect(podcastData.episodes).to.be.an('array');
    });

    it('should extract episode data correctly', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const podcastData = await parsePodcastFeed(feedURL);

      // Verify episodes exist
      expect(podcastData.episodes.length).to.be.greaterThan(0);

      const firstEpisode = podcastData.episodes[0];
      expect(firstEpisode).to.have.property('guid');
      expect(firstEpisode).to.have.property('title');
      expect(firstEpisode).to.have.property('description');
      expect(firstEpisode).to.have.property('pubDate');
      expect(firstEpisode.pubDate).to.be.instanceOf(Date);
    });

    it('should handle malformed feeds gracefully', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'malformed-feed.xml');
      const feedURL = 'file://' + feedPath;

      try {
        await parsePodcastFeed(feedURL);
        expect.fail('Should have thrown an error for malformed feed');
      } catch (error) {
        expect(error.message).to.include('Failed to parse RSS feed');
      }
    });
  });

  describe('findEpisodeByGuid', function() {
    it('should find an episode by GUID', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      // First get the podcast data to find a valid GUID
      const podcastData = await parsePodcastFeed(feedURL);
      const firstEpisodeGuid = podcastData.episodes[0].guid;

      // Now test findEpisodeByGuid
      const result = await findEpisodeByGuid(feedURL, firstEpisodeGuid);

      expect(result).to.have.property('episode');
      expect(result).to.have.property('podcast');
      expect(result.episode.guid).to.equal(firstEpisodeGuid);
      expect(result.podcast).to.have.property('title');
      expect(result.podcast).to.have.property('imageUrl');
    });

    it('should throw error for non-existent GUID', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      try {
        await findEpisodeByGuid(feedURL, 'non-existent-guid-12345');
        expect.fail('Should have thrown an error for non-existent GUID');
      } catch (error) {
        expect(error.message).to.equal('Episode not found');
      }
    });

    it('should find episode with whitespace in GUID', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'sample-valid-feed.xml');
      const feedURL = 'file://' + feedPath;

      const podcastData = await parsePodcastFeed(feedURL);
      const firstEpisodeGuid = podcastData.episodes[0].guid;

      // Test with leading/trailing whitespace - should still find the episode
      const result = await findEpisodeByGuid(feedURL, '  ' + firstEpisodeGuid + '  ');

      expect(result.episode.guid).to.equal(firstEpisodeGuid);
    });
  });

  describe('HTML detection in descriptions', function() {
    it('should detect HTML tags in podcast description and set descriptionHtml', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'feed-with-html-description.xml');
      const feedURL = 'file://' + feedPath;

      const podcastData = await parsePodcastFeed(feedURL);

      // Podcast description has HTML tags, so descriptionHtml should be set
      expect(podcastData.descriptionHtml).to.not.be.null;
      expect(podcastData.descriptionHtml).to.include('<p>');
      expect(podcastData.descriptionHtml).to.include('<a href=');
    });

    it('should detect HTML tags in episode description and set descriptionHtml', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'feed-with-html-description.xml');
      const feedURL = 'file://' + feedPath;

      const podcastData = await parsePodcastFeed(feedURL);

      // Find the episode with HTML in description
      const htmlEpisode = podcastData.episodes.find(ep => ep.guid === 'episode-with-html-desc');
      expect(htmlEpisode.descriptionHtml).to.not.be.null;
      expect(htmlEpisode.descriptionHtml).to.include('<p>');
      expect(htmlEpisode.descriptionHtml).to.include('<strong>');
    });

    it('should not set descriptionHtml for plain text descriptions', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'feed-with-html-description.xml');
      const feedURL = 'file://' + feedPath;

      const podcastData = await parsePodcastFeed(feedURL);

      // Find the episode with plain text description
      const plainEpisode = podcastData.episodes.find(ep => ep.guid === 'episode-with-plain-desc');
      expect(plainEpisode.descriptionHtml).to.be.null;
      expect(plainEpisode.description).to.equal('This is just plain text with no HTML tags at all.');
    });

    it('should detect HTML entities as HTML content', async function() {
      const feedPath = path.join(__dirname, 'fixtures', 'feed-with-html-description.xml');
      const feedURL = 'file://' + feedPath;

      const podcastData = await parsePodcastFeed(feedURL);

      // Find the episode with only HTML entities
      const entityEpisode = podcastData.episodes.find(ep => ep.guid === 'episode-with-entities-only');
      // Entities like &amp; &nbsp; &mdash; should be detected as HTML
      expect(entityEpisode.descriptionHtml).to.not.be.null;
    });
  });
});
