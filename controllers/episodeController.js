const { findEpisodeByGuid } = require('../services/rssParser')
const { generateEpisodeLink, generateEpisodeWebUrl } = require('../services/urlHelper')
const { createMetaDescription, createOgDescription } = require('../services/htmlHelper')

/**
 * Episode Page Controller
 * Handles requests to display individual episode information
 */

/**
 * Render episode page
 * GET /podhaven/episode?feedURL=...&guid=...
 * Note: feedURL and guid validation is handled by middleware
 */
async function showEpisode(req, res) {
  try {
    const { feedURL, guid } = req.query

    // Fetch episode data
    let episodeData
    try {
      episodeData = await findEpisodeByGuid(feedURL, guid)
    } catch (error) {
      // Log error for debugging
      console.error(`[ERROR] Failed to fetch/find episode: ${error.message}`)

      // Check if it's a "not found" error vs a feed error
      if (error.message === 'Episode not found') {
        return res.status(404).render('error', {
          statusCode: 404,
          errorTitle: 'Episode Not Found',
          errorMessage: 'The requested episode could not be found in the podcast feed.'
        })
      }

      return res.status(500).render('error', {
        statusCode: 500,
        errorTitle: 'Feed Error',
        errorMessage: 'Unable to fetch or parse the podcast feed. Please verify the feed URL is correct and accessible.'
      })
    }

    // Generate links
    const episodeShareLink = generateEpisodeLink(feedURL, guid)
    const episodeWebUrl = generateEpisodeWebUrl(feedURL, guid)
    const podcastPageUrl = `/podhaven/podcast?feedURL=${encodeURIComponent(feedURL)}`

    // Use episode image or fallback to podcast image
    const episodeImage = episodeData.episode.imageUrl || episodeData.podcast.imageUrl

    // Pre-process descriptions for meta tags
    const metaDescription = createMetaDescription(episodeData.episode.description)
    const ogDescription = createOgDescription(episodeData.episode.description)

    // Render episode page
    res.render('episode', {
      episode: episodeData.episode,
      podcast: episodeData.podcast,
      episodeImage,
      episodeShareLink,
      episodeWebUrl,
      podcastPageUrl,
      feedURL,
      metaDescription,
      ogDescription
    })

  } catch (error) {
    // Catch-all for unexpected errors
    console.error(`[ERROR] Unexpected error in showEpisode: ${error.message}`)

    res.status(500).render('error', {
      statusCode: 500,
      errorTitle: 'Server Error',
      errorMessage: 'An unexpected error occurred. Please try again later.'
    })
  }
}

module.exports = {
  showEpisode
}
