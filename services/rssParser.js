const Parser = require('rss-parser');
const https = require('https');
const http = require('http');
const fs = require('fs').promises;

/**
 * RSS Parser Service
 * Fetches and parses podcast RSS feeds with timeout handling
 */

const RSS_TIMEOUT = parseInt(process.env.RSS_TIMEOUT) || 10000;

/**
 * Fetch RSS feed from URL with timeout and redirect support
 * @param {string} feedURL - The URL of the RSS feed
 * @param {number} redirectCount - Current redirect depth (internal use)
 * @returns {Promise<string>} The RSS feed XML content
 */
async function fetchFeedWithTimeout(feedURL, redirectCount = 0) {
  const MAX_REDIRECTS = 5;

  if (redirectCount > MAX_REDIRECTS) {
    throw new Error('Too many redirects');
  }

  const url = new URL(feedURL);

  // Support file:// URLs for testing
  if (url.protocol === 'file:') {
    const filePath = url.pathname;
    return await fs.readFile(filePath, 'utf-8');
  }

  return new Promise((resolve, reject) => {
    const protocol = url.protocol === 'https:' ? https : http;
    let req;

    const timeout = setTimeout(() => {
      if (req) req.destroy();
      reject(new Error(`Request timeout after ${RSS_TIMEOUT}ms`));
    }, RSS_TIMEOUT);

    req = protocol.get(feedURL, (res) => {
      clearTimeout(timeout);

      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        const redirectUrl = res.headers.location;
        if (!redirectUrl) {
          reject(new Error(`HTTP ${res.statusCode}: Redirect without location header`));
          return;
        }

        // Follow the redirect
        fetchFeedWithTimeout(redirectUrl, redirectCount + 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: Failed to fetch RSS feed`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (err) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to fetch RSS feed: ${err.message}`));
    });
  });
}

/**
 * Parse RSS feed and extract podcast data
 * @param {string} feedURL - The URL of the RSS feed to parse
 * @returns {Promise<Object>} Parsed podcast data with episodes
 */
async function parsePodcastFeed(feedURL) {
  try {
    // Fetch the feed with timeout
    const feedXml = await fetchFeedWithTimeout(feedURL);

    // Configure parser to extract custom fields
    const parser = new Parser({
      customFields: {
        feed: [['itunes:author', 'itunesAuthor']],
        item: [
          ['itunes:duration', 'duration'],
          ['itunes:image', 'itunesImage'],
          ['itunes:summary', 'itunesSummary'],
          ['content:encoded', 'contentEncoded']
        ]
      }
    });

    // Parse the feed
    const feed = await parser.parseString(feedXml);

    // Extract podcast metadata
    const podcastData = {
      title: feed.title || 'Unknown Podcast',
      description: feed.description || feed.itunes?.summary || '',
      descriptionHtml: feed.contentEncoded || null,
      author: feed.itunesAuthor || feed.author || feed.itunes?.owner?.name || 'Unknown Author',
      imageUrl: feed.itunes?.image || feed.image?.url || '',
      link: feed.link || '',
      episodes: []
    };

    // Parse episodes
    if (feed.items && feed.items.length > 0) {
      podcastData.episodes = feed.items.map(item => {
        // Find audio enclosure
        const audioEnclosure = item.enclosure?.url || '';

        // Get episode image - try itunes:image first, then fall back to podcast image
        let episodeImageUrl = null;
        if (item.itunesImage && item.itunesImage.href) {
          episodeImageUrl = item.itunesImage.href;
        } else if (item.itunes && item.itunes.image) {
          episodeImageUrl = item.itunes.image;
        }

        return {
          guid: item.guid || item.link || '',
          title: item.title || 'Untitled Episode',
          description: item.itunesSummary || item.description || item.content || '',
          descriptionHtml: item.contentEncoded || null,
          imageUrl: episodeImageUrl,
          audioUrl: audioEnclosure,
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          duration: item.duration || null
        };
      });
    }

    return podcastData;
  } catch (error) {
    if (error.message.includes('timeout')) {
      throw new Error('RSS feed request timed out');
    } else if (error.message.includes('HTTP')) {
      throw error;
    } else {
      throw new Error(`Failed to parse RSS feed: ${error.message}`);
    }
  }
}

/**
 * Find a specific episode by GUID in the feed
 * @param {string} feedURL - The URL of the RSS feed
 * @param {string} guid - The episode GUID to find
 * @returns {Promise<Object>} The episode data with podcast info
 */
async function findEpisodeByGuid(feedURL, guid) {
  const podcastData = await parsePodcastFeed(feedURL);

  const episode = podcastData.episodes.find(ep => ep.guid === guid);

  if (!episode) {
    throw new Error('Episode not found');
  }

  // Return episode with podcast context for fallback image
  return {
    episode,
    podcast: {
      title: podcastData.title,
      imageUrl: podcastData.imageUrl,
      link: podcastData.link
    }
  };
}

module.exports = {
  parsePodcastFeed,
  findEpisodeByGuid
};
