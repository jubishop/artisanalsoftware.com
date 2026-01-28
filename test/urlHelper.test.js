const { expect } = require('chai');
const {
  generatePodcastLink,
  generateEpisodeLink,
  generatePodcastWebUrl,
  generateEpisodeWebUrl,
  isValidUrl,
  parseTimestamp
} = require('../services/urlHelper');

describe('URL Helper Service', function() {
  describe('generatePodcastLink', function() {
    it('should generate a valid PodHaven podcast link', function() {
      const feedURL = 'https://feeds.example.com/podcast.xml';
      const link = generatePodcastLink(feedURL);

      expect(link).to.include('podhaven://share?url=');
      // Decode to verify the structure
      const decodedUrl = decodeURIComponent(link.replace('podhaven://share?url=', ''));
      expect(decodedUrl).to.include('artisanalsoftware.com');
      expect(decodedUrl).to.include('podhaven/podcast');
    });

    it('should properly encode feed URLs with special characters', function() {
      const feedURL = 'https://feeds.example.com/podcast?id=123&type=rss';
      const link = generatePodcastLink(feedURL);

      expect(link).to.include('podhaven://share?url=');
      // The URL should be double-encoded (once for the web URL params, once for the app link)
      expect(link).to.not.include('?id=123&type=rss');
    });
  });

  describe('generateEpisodeLink', function() {
    it('should generate a valid PodHaven episode link', function() {
      const feedURL = 'https://feeds.example.com/podcast.xml';
      const guid = 'episode-123';
      const link = generateEpisodeLink(feedURL, guid);

      expect(link).to.include('podhaven://share?url=');
      // Decode to verify the structure
      const decodedUrl = decodeURIComponent(link.replace('podhaven://share?url=', ''));
      expect(decodedUrl).to.include('artisanalsoftware.com');
      expect(decodedUrl).to.include('podhaven/episode');
    });

    it('should properly encode episode GUIDs with special characters', function() {
      const feedURL = 'https://feeds.example.com/podcast.xml';
      const guid = 'https://example.com/episode?id=123';
      const link = generateEpisodeLink(feedURL, guid);

      expect(link).to.include('podhaven://share?url=');
      // The GUID should be encoded
      expect(link).to.not.include('?id=123');
    });

    it('should include timestamp in link when provided', function() {
      const feedURL = 'https://feeds.example.com/podcast.xml';
      const guid = 'episode-123';
      const link = generateEpisodeLink(feedURL, guid, 90);

      const decodedUrl = decodeURIComponent(link.replace('podhaven://share?url=', ''));
      expect(decodedUrl).to.include('&startTime=90');
    });

    it('should not include timestamp when zero or null', function() {
      const feedURL = 'https://feeds.example.com/podcast.xml';
      const guid = 'episode-123';

      const linkWithZero = generateEpisodeLink(feedURL, guid, 0);
      const linkWithNull = generateEpisodeLink(feedURL, guid, null);

      expect(linkWithZero).to.not.include('&startTime=');
      expect(linkWithNull).to.not.include('&startTime=');
    });
  });

  describe('generatePodcastWebUrl', function() {
    it('should generate a valid web URL for podcast', function() {
      const feedURL = 'https://feeds.example.com/podcast.xml';
      const webUrl = generatePodcastWebUrl(feedURL);

      expect(webUrl).to.equal('https://artisanalsoftware.com/podhaven/podcast?feedURL=https%3A%2F%2Ffeeds.example.com%2Fpodcast.xml');
    });

    it('should encode feed URL parameters', function() {
      const feedURL = 'https://feeds.example.com/podcast?id=123';
      const webUrl = generatePodcastWebUrl(feedURL);

      expect(webUrl).to.include('feedURL=');
      expect(webUrl).to.not.include('?id=123');
      expect(webUrl).to.include('%3F'); // encoded '?'
    });
  });

  describe('generateEpisodeWebUrl', function() {
    it('should generate a valid web URL for episode', function() {
      const feedURL = 'https://feeds.example.com/podcast.xml';
      const guid = 'episode-123';
      const webUrl = generateEpisodeWebUrl(feedURL, guid);

      expect(webUrl).to.include('https://artisanalsoftware.com/podhaven/episode');
      expect(webUrl).to.include('feedURL=');
      expect(webUrl).to.include('guid=');
    });

    it('should encode both feedURL and guid parameters', function() {
      const feedURL = 'https://feeds.example.com/podcast.xml';
      const guid = 'https://example.com/episode?id=123';
      const webUrl = generateEpisodeWebUrl(feedURL, guid);

      expect(webUrl).to.include('feedURL=');
      expect(webUrl).to.include('guid=');
      // Check that special characters are encoded
      expect(webUrl).to.include('%3A%2F%2F'); // encoded '://'
    });

    it('should include timestamp when provided', function() {
      const feedURL = 'https://feeds.example.com/podcast.xml';
      const guid = 'episode-123';
      const webUrl = generateEpisodeWebUrl(feedURL, guid, 90);

      expect(webUrl).to.include('&startTime=90');
    });

    it('should not include timestamp when zero or null', function() {
      const feedURL = 'https://feeds.example.com/podcast.xml';
      const guid = 'episode-123';

      const urlWithZero = generateEpisodeWebUrl(feedURL, guid, 0);
      const urlWithNull = generateEpisodeWebUrl(feedURL, guid, null);

      expect(urlWithZero).to.not.include('&startTime=');
      expect(urlWithNull).to.not.include('&startTime=');
    });
  });

  describe('parseTimestamp', function() {
    it('should parse seconds as integer string', function() {
      expect(parseTimestamp('90')).to.equal(90);
      expect(parseTimestamp('0')).to.equal(0);
      expect(parseTimestamp('3600')).to.equal(3600);
    });

    it('should return null for non-numeric strings', function() {
      expect(parseTimestamp('abc')).to.be.null;
      expect(parseTimestamp('1:30')).to.be.null;
      expect(parseTimestamp('')).to.be.null;
      expect(parseTimestamp(null)).to.be.null;
      expect(parseTimestamp(undefined)).to.be.null;
    });
  });

  describe('isValidUrl', function() {
    it('should return true for valid HTTP URLs', function() {
      expect(isValidUrl('http://example.com')).to.be.true;
      expect(isValidUrl('https://example.com')).to.be.true;
    });

    it('should return true for valid URLs with paths and query strings', function() {
      expect(isValidUrl('https://example.com/path/to/feed.xml')).to.be.true;
      expect(isValidUrl('https://example.com/feed?id=123')).to.be.true;
    });

    it('should return false for invalid URLs', function() {
      expect(isValidUrl('not a url')).to.be.false;
      expect(isValidUrl('')).to.be.false;
    });

    it('should return false for non-HTTP protocols', function() {
      expect(isValidUrl('ftp://example.com')).to.be.false;
      expect(isValidUrl('file:///path/to/file')).to.be.false;
      expect(isValidUrl('javascript:alert(1)')).to.be.false;
    });

    it('should return false for null or undefined', function() {
      expect(isValidUrl(null)).to.be.false;
      expect(isValidUrl(undefined)).to.be.false;
    });
  });
});
