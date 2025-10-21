const { expect } = require('chai');
const { parsePodcastFeed, findEpisodeByGuid } = require('../services/rssParser');
const fs = require('fs');
const path = require('path');

describe('RSS Parser Service', function() {
  // Increase timeout for RSS parsing
  this.timeout(5000);

  describe('parsePodcastFeed', function() {
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
  });
});
