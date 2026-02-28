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

/**
 * Convert a timestamp string (HH:MM:SS, MM:SS, or M:SS) to seconds
 * @param {string} timestamp - Timestamp string
 * @returns {number} Total seconds
 */
function timestampToSeconds(timestamp) {
  const parts = timestamp.split(':').map(p => parseInt(p, 10))

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1]
  }

  return 0
}

/**
 * Process HTML to make timestamps clickable
 * Converts timestamps like "1:23:45" or "15:30" into links to the episode at that time
 * @param {string} html - HTML content with potential timestamps
 * @param {string} episodeUrl - Base URL for the episode page (with feedURL and guid params)
 * @returns {string} HTML with timestamps converted to links
 */
function processTimestamps(html, episodeUrl) {
  if (!html || typeof html !== 'string') {
    return html
  }

  // Regex to match timestamps:
  // - H:MM:SS or HH:MM:SS (1:23:45, 01:23:45)
  // - M:SS or MM:SS (5:30, 15:30)
  // The negative lookbehind (?<![:\d]) prevents matching partial timestamps
  // The negative lookahead (?![:\d]) prevents matching partial timestamps
  const timestampRegex = /(?<![:\d])(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})(?![:\d])/g

  // Track position to avoid processing timestamps inside HTML tags
  let result = ''
  let lastIndex = 0
  let inTag = false
  let inAttr = false

  for (let i = 0; i < html.length; i++) {
    if (html[i] === '<') {
      inTag = true
    } else if (html[i] === '>') {
      inTag = false
      inAttr = false
    } else if (inTag && (html[i] === '"' || html[i] === "'")) {
      inAttr = !inAttr
    }
  }

  // Simple approach: split by HTML tags, process text nodes only
  const parts = html.split(/(<[^>]*>)/g)

  for (const part of parts) {
    if (part.startsWith('<')) {
      // This is an HTML tag, don't process it
      result += part
    } else {
      // This is text content, process timestamps
      result += part.replace(timestampRegex, (match) => {
        const seconds = timestampToSeconds(match)
        // Determine the separator based on whether episodeUrl already has query params
        const separator = episodeUrl.includes('?') ? '&' : '?'
        const href = `${episodeUrl}${separator}startTime=${seconds}`
        return `<a href="${href}" class="timestamp-link">${match}</a>`
      })
    }
  }

  return result
}

module.exports = {
  stripHtml,
  createMetaDescription,
  createOgDescription,
  processTimestamps,
  timestampToSeconds
}
