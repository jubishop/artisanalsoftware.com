/**
 * URL Helper Service
 * Generates PodHaven app deep links and handles URL encoding
 */

const config = require('../config')

const ALLOWED_PROTOCOLS = ['http:', 'https:']

/**
 * Generate PodHaven app link for a podcast
 * @param {string} feedURL - The RSS feed URL
 * @returns {string} PodHaven deep link
 */
function generatePodcastLink(feedURL) {
  const webUrl = `${config.baseUrl}/podhaven/podcast?feedURL=${encodeURIComponent(feedURL)}`
  return `podhaven://share?url=${encodeURIComponent(webUrl)}`
}

/**
 * Generate PodHaven app link for an episode
 * @param {string} feedURL - The RSS feed URL
 * @param {string} guid - The episode GUID
 * @returns {string} PodHaven deep link
 */
function generateEpisodeLink(feedURL, guid) {
  const webUrl = `${config.baseUrl}/podhaven/episode?feedURL=${encodeURIComponent(feedURL)}&guid=${encodeURIComponent(guid)}`
  return `podhaven://share?url=${encodeURIComponent(webUrl)}`
}

/**
 * Generate web URL for a podcast page
 * @param {string} feedURL - The RSS feed URL
 * @returns {string} Web URL
 */
function generatePodcastWebUrl(feedURL) {
  return `${config.baseUrl}/podhaven/podcast?feedURL=${encodeURIComponent(feedURL)}`
}

/**
 * Generate web URL for an episode page
 * @param {string} feedURL - The RSS feed URL
 * @param {string} guid - The episode GUID
 * @returns {string} Web URL
 */
function generateEpisodeWebUrl(feedURL, guid) {
  return `${config.baseUrl}/podhaven/episode?feedURL=${encodeURIComponent(feedURL)}&guid=${encodeURIComponent(guid)}`
}

/**
 * Validate if a string is a valid HTTP/HTTPS URL
 * Only allows http: and https: protocols for security
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid HTTP/HTTPS URL
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url)
    return ALLOWED_PROTOCOLS.includes(parsed.protocol)
  } catch (error) {
    return false
  }
}

/**
 * Validate if a URL uses a safe protocol (http/https)
 * Used for validating media URLs from RSS feeds
 * @param {string} url - The URL to validate
 * @returns {boolean} True if safe protocol
 */
function isSafeMediaUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url)
    return ALLOWED_PROTOCOLS.includes(parsed.protocol)
  } catch (error) {
    return false
  }
}

module.exports = {
  generatePodcastLink,
  generateEpisodeLink,
  generatePodcastWebUrl,
  generateEpisodeWebUrl,
  isValidUrl,
  isSafeMediaUrl
}
