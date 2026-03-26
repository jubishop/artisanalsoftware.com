/**
 * Centralized Configuration
 * All environment variables and constants in one place
 */

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,

  // Environment
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // Base URL for generating links (must be set in production)
  baseUrl: process.env.BASE_URL || 'https://artisanalsoftware.com',

  // RSS feed fetching
  rssTimeout: parseInt(process.env.RSS_TIMEOUT) || 10000,

  // Input validation limits
  maxFeedUrlLength: 2048,
  maxGuidLength: 512,

  // Rate limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 150, // requests per window

  // Meta description length limits
  metaDescriptionLength: 160,
  ogDescriptionLength: 200
}
