const { parsePodcastFeed } = require('../services/rssParser');
const { generatePodcastLink, generatePodcastWebUrl, generateEpisodeLink, isValidUrl } = require('../services/urlHelper');

/**
 * Podcast Page Controller
 * Handles requests to display podcast information
 */

/**
 * Render podcast page
 * GET /podhaven/podcast?feedURL=...
 */
async function showPodcast(req, res) {
  try {
    const { feedURL } = req.query;

    // Validate feedURL parameter
    if (!feedURL) {
      return res.status(400).render('error', {
        statusCode: 400,
        errorTitle: 'Missing Feed URL',
        errorMessage: 'Please provide a valid RSS feed URL using the feedURL parameter.'
      });
    }

    // Validate URL format
    if (!isValidUrl(feedURL)) {
      return res.status(400).render('error', {
        statusCode: 400,
        errorTitle: 'Invalid Feed URL',
        errorMessage: 'The provided feed URL is not valid. Please check the URL and try again.'
      });
    }

    // Fetch and parse podcast feed
    let podcastData;
    try {
      podcastData = await parsePodcastFeed(feedURL);
    } catch (error) {
      // Log error for debugging
      console.error(`[ERROR] Failed to fetch/parse RSS feed: ${error.message}`);

      return res.status(500).render('error', {
        statusCode: 500,
        errorTitle: 'Feed Error',
        errorMessage: 'Unable to fetch or parse the podcast feed. Please verify the feed URL is correct and accessible.'
      });
    }

    // Generate PodHaven links
    const podcastShareLink = generatePodcastLink(feedURL);
    const podcastWebUrl = generatePodcastWebUrl(feedURL);

    // Generate episode links
    const episodesWithLinks = podcastData.episodes.map(episode => ({
      ...episode,
      shareLink: generateEpisodeLink(feedURL, episode.guid),
      webUrl: `/podhaven/episode?feedURL=${encodeURIComponent(feedURL)}&guid=${encodeURIComponent(episode.guid)}`
    }));

    // Render podcast page
    res.render('podcast', {
      podcast: podcastData,
      episodes: episodesWithLinks,
      podcastShareLink,
      podcastWebUrl,
      feedURL
    });

  } catch (error) {
    // Catch-all for unexpected errors
    console.error(`[ERROR] Unexpected error in showPodcast: ${error.message}`);

    res.status(500).render('error', {
      statusCode: 500,
      errorTitle: 'Server Error',
      errorMessage: 'An unexpected error occurred. Please try again later.'
    });
  }
}

module.exports = {
  showPodcast
};
