/**
 * HTML Helper Service
 * Utilities for safely handling HTML content
 */

const config = require('../config')

/**
 * Strip HTML tags from a string more robustly than regex
 * Handles nested tags, malformed HTML, and edge cases
 * @param {string} html - HTML string to strip
 * @returns {string} Plain text without HTML tags
 */
function stripHtml(html) {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // Replace common block elements with spaces to preserve word boundaries
  let text = html
    .replace(/<(br|p|div|li|h[1-6])[^>]*>/gi, ' ')
    .replace(/<\/?(p|div|li|h[1-6])[^>]*>/gi, ' ')

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]*>/g, '')

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")

  // Normalize whitespace (collapse multiple spaces/newlines to single space)
  text = text.replace(/\s+/g, ' ').trim()

  return text
}

/**
 * Create a meta description from HTML content
 * Strips HTML and truncates to appropriate length
 * @param {string} html - HTML string to process
 * @param {number} maxLength - Maximum length (default from config)
 * @returns {string} Plain text truncated for meta description
 */
function createMetaDescription(html, maxLength = config.metaDescriptionLength) {
  const text = stripHtml(html)

  if (text.length <= maxLength) {
    return text
  }

  // Truncate at word boundary if possible
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...'
  }

  return truncated + '...'
}

/**
 * Create an Open Graph description from HTML content
 * Strips HTML and truncates to OG-appropriate length
 * @param {string} html - HTML string to process
 * @returns {string} Plain text truncated for OG description
 */
function createOgDescription(html) {
  return createMetaDescription(html, config.ogDescriptionLength)
}

module.exports = {
  stripHtml,
  createMetaDescription,
  createOgDescription
}
