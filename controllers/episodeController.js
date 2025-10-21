const { findEpisodeByGuid } = require('../services/rssParser');
const { generateEpisodeLink, generateEpisodeWebUrl, generatePodcastWebUrl, isValidUrl } = require('../services/urlHelper');

/**
 * Episode Page Controller
 * Handles requests to display individual episode information
 */

/**
 * Render episode page
 * GET /podhaven/episode?feedURL=...&guid=...
 */
async function showEpisode(req, res) {
  try {
    const { feedURL, guid } = req.query;

    // Validate feedURL parameter
    if (!feedURL) {
      return res.status(400).render('error', {
        statusCode: 400,
        errorTitle: 'Missing Feed URL',
        errorMessage: 'Please provide a valid RSS feed URL using the feedURL parameter.'
      });
    }

    // Validate guid parameter
    if (!guid) {
      return res.status(400).render('error', {
        statusCode: 400,
        errorTitle: 'Missing Episode GUID',
        errorMessage: 'Please provide a valid episode GUID using the guid parameter.'
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

    // Fetch episode data
    let episodeData;
    try {
      episodeData = await findEpisodeByGuid(feedURL, guid);
    } catch (error) {
      // Log error for debugging
      console.error(`[ERROR] Failed to fetch/find episode: ${error.message}`);

      // Check if it's a "not found" error vs a feed error
      if (error.message === 'Episode not found') {
        return res.status(404).render('error', {
          statusCode: 404,
          errorTitle: 'Episode Not Found',
          errorMessage: 'The requested episode could not be found in the podcast feed.'
        });
      }

      return res.status(500).render('error', {
        statusCode: 500,
        errorTitle: 'Feed Error',
        errorMessage: 'Unable to fetch or parse the podcast feed. Please verify the feed URL is correct and accessible.'
      });
    }

    // Generate links
    const episodeShareLink = generateEpisodeLink(feedURL, guid);
    const episodeWebUrl = generateEpisodeWebUrl(feedURL, guid);
    const podcastPageUrl = `/podhaven/podcast?feedURL=${encodeURIComponent(feedURL)}`;

    // Use episode image or fallback to podcast image
    const episodeImage = episodeData.episode.imageUrl || episodeData.podcast.imageUrl;

    // Render episode page
    res.render('episode', {
      episode: episodeData.episode,
      podcast: episodeData.podcast,
      episodeImage,
      episodeShareLink,
      episodeWebUrl,
      podcastPageUrl,
      feedURL
    });

  } catch (error) {
    // Catch-all for unexpected errors
    console.error(`[ERROR] Unexpected error in showEpisode: ${error.message}`);

    res.status(500).render('error', {
      statusCode: 500,
      errorTitle: 'Server Error',
      errorMessage: 'An unexpected error occurred. Please try again later.'
    });
  }
}

module.exports = {
  showEpisode
};
