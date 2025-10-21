/**
 * URL Helper Service
 * Generates PodHaven app deep links and handles URL encoding
 */

const BASE_URL = 'https://artisanalsoftware.com';

/**
 * Generate PodHaven app link for a podcast
 * @param {string} feedURL - The RSS feed URL
 * @returns {string} PodHaven deep link
 */
function generatePodcastLink(feedURL) {
  const webUrl = `${BASE_URL}/podhaven/podcast?feedURL=${encodeURIComponent(feedURL)}`;
  return `podhaven://share?url=${encodeURIComponent(webUrl)}`;
}

/**
 * Generate PodHaven app link for an episode
 * @param {string} feedURL - The RSS feed URL
 * @param {string} guid - The episode GUID
 * @returns {string} PodHaven deep link
 */
function generateEpisodeLink(feedURL, guid) {
  const webUrl = `${BASE_URL}/podhaven/episode?feedURL=${encodeURIComponent(feedURL)}&guid=${encodeURIComponent(guid)}`;
  return `podhaven://share?url=${encodeURIComponent(webUrl)}`;
}

/**
 * Generate web URL for a podcast page
 * @param {string} feedURL - The RSS feed URL
 * @returns {string} Web URL
 */
function generatePodcastWebUrl(feedURL) {
  return `${BASE_URL}/podhaven/podcast?feedURL=${encodeURIComponent(feedURL)}`;
}

/**
 * Generate web URL for an episode page
 * @param {string} feedURL - The RSS feed URL
 * @param {string} guid - The episode GUID
 * @returns {string} Web URL
 */
function generateEpisodeWebUrl(feedURL, guid) {
  return `${BASE_URL}/podhaven/episode?feedURL=${encodeURIComponent(feedURL)}&guid=${encodeURIComponent(guid)}`;
}

/**
 * Validate if a string is a valid URL
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid URL
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  generatePodcastLink,
  generateEpisodeLink,
  generatePodcastWebUrl,
  generateEpisodeWebUrl,
  isValidUrl
};
