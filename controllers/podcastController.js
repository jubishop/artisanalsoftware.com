const { parsePodcastFeed } = require('../services/rssParser')
const { generatePodcastLink, generatePodcastWebUrl, generateEpisodeLink } = require('../services/urlHelper')
const { createMetaDescription, createOgDescription } = require('../services/htmlHelper')

/**
 * Podcast Page Controller
 * Handles requests to display podcast information
 */

/**
 * Render podcast page
 * GET /podhaven/podcast?feedURL=...
 * Note: feedURL validation is handled by middleware
 */
async function showPodcast(req, res) {
  try {
    const { feedURL } = req.query

    // Fetch and parse podcast feed
    let podcastData
    try {
      podcastData = await parsePodcastFeed(feedURL)
    } catch (error) {
      // Log error for debugging
      console.error(`[ERROR] Failed to fetch/parse RSS feed: ${error.message}`)

      return res.status(500).render('error', {
        statusCode: 500,
        errorTitle: 'Feed Error',
        errorMessage: 'Unable to fetch or parse the podcast feed. Please verify the feed URL is correct and accessible.'
      })
    }

    // Generate PodHaven links
    const podcastShareLink = generatePodcastLink(feedURL, req.hostname)
    const podcastWebUrl = generatePodcastWebUrl(feedURL)

    // Generate episode links
    const episodesWithLinks = podcastData.episodes.map(episode => ({
      ...episode,
      shareLink: generateEpisodeLink(feedURL, episode.guid, undefined, req.hostname),
      webUrl: `/podhaven/episode?feedURL=${encodeURIComponent(feedURL)}&guid=${encodeURIComponent(episode.guid)}`
    }))

    // Pre-process descriptions for meta tags
    const metaDescription = createMetaDescription(podcastData.description)
    const ogDescription = createOgDescription(podcastData.description)

    // Render podcast page
    res.render('podcast', {
      podcast: podcastData,
      episodes: episodesWithLinks,
      podcastShareLink,
      podcastWebUrl,
      feedURL,
      metaDescription,
      ogDescription
    })

  } catch (error) {
    // Catch-all for unexpected errors
    console.error(`[ERROR] Unexpected error in showPodcast: ${error.message}`)

    res.status(500).render('error', {
      statusCode: 500,
      errorTitle: 'Server Error',
      errorMessage: 'An unexpected error occurred. Please try again later.'
    })
  }
}

module.exports = {
  showPodcast
}
