/**
 * Feed URL Validation Middleware
 * Validates feedURL query parameter for all podcast routes
 */

const config = require('../config')
const { isValidUrl } = require('../services/urlHelper')

/**
 * Check if a URL is a valid file:// URL (for testing only)
 * @param {string} url - The URL to check
 * @returns {boolean} True if valid file URL
 */
function isValidFileUrl(url) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'file:'
  } catch (error) {
    return false
  }
}

/**
 * Validate feedURL query parameter
 * Checks: presence, length, and URL format
 */
function validateFeedUrl(req, res, next) {
  const { feedURL } = req.query

  // Check if feedURL is present
  if (!feedURL) {
    return res.status(400).render('error', {
      statusCode: 400,
      errorTitle: 'Missing Feed URL',
      errorMessage: 'Please provide a valid RSS feed URL using the feedURL parameter.'
    })
  }

  // Check feedURL length
  if (feedURL.length > config.maxFeedUrlLength) {
    return res.status(400).render('error', {
      statusCode: 400,
      errorTitle: 'Feed URL Too Long',
      errorMessage: `The feed URL exceeds the maximum length of ${config.maxFeedUrlLength} characters.`
    })
  }

  // Validate URL format (http/https only, or file:// in non-production)
  const isValid = isValidUrl(feedURL) || (!config.isProduction && isValidFileUrl(feedURL))
  if (!isValid) {
    return res.status(400).render('error', {
      statusCode: 400,
      errorTitle: 'Invalid Feed URL',
      errorMessage: 'The provided feed URL is not valid. Please provide a valid HTTP or HTTPS URL.'
    })
  }

  next()
}

/**
 * Validate guid query parameter (for episode routes)
 * Checks: presence and length
 */
function validateGuid(req, res, next) {
  const { guid } = req.query

  // Check if guid is present
  if (!guid) {
    return res.status(400).render('error', {
      statusCode: 400,
      errorTitle: 'Missing Episode GUID',
      errorMessage: 'Please provide a valid episode GUID using the guid parameter.'
    })
  }

  // Check guid length
  if (guid.length > config.maxGuidLength) {
    return res.status(400).render('error', {
      statusCode: 400,
      errorTitle: 'Episode GUID Too Long',
      errorMessage: `The episode GUID exceeds the maximum length of ${config.maxGuidLength} characters.`
    })
  }

  next()
}

module.exports = {
  validateFeedUrl,
  validateGuid
}
