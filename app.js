const express = require('express')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const config = require('./config')
const podcastController = require('./controllers/podcastController')
const episodeController = require('./controllers/episodeController')
const podhavenLandingController = require('./controllers/podhavenLandingController')
const siteController = require('./controllers/siteController')
const universalLinkController = require('./controllers/universalLinkController')
const { validateFeedUrl, validateGuid } = require('./middleware/validateFeedUrl')

const app = express()

// Content-hash cache-busting for static assets. Templates call assetUrl() to
// append ?v=<hash> to a /public path, so any content change yields a new URL.
// Without this, returning visitors keep a stale cached CSS (the files are
// served with a multi-hour cache-control) and pair it with freshly deployed
// HTML — exactly what breaks the layout after a redesign. Hashes are computed
// once per asset and memoized for the life of the process.
const assetUrlCache = new Map()
function assetUrl(publicPath) {
  if (!assetUrlCache.has(publicPath)) {
    let versioned = publicPath
    try {
      const abs = path.join(__dirname, publicPath.replace(/^\//, ''))
      const hash = crypto.createHash('md5').update(fs.readFileSync(abs)).digest('hex').slice(0, 8)
      versioned = `${publicPath}?v=${hash}`
    } catch {
      // Missing/unreadable asset → fall back to the unversioned path.
    }
    assetUrlCache.set(publicPath, versioned)
  }
  return assetUrlCache.get(publicPath)
}
app.locals.assetUrl = assetUrl

// Behind Cloudflare → Railway proxy. Trust the forwarded chain so req.ip
// reflects the real client IP instead of the proxy's IP (otherwise the
// rate limiter treats all traffic as coming from a single address).
app.set('trust proxy', true)

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[ERROR] Unhandled Rejection at:', promise, 'reason:', reason)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[ERROR] Uncaught Exception:', error)
  process.exit(1)
})

// Security headers (helmet)
const cspDirectives = {
  defaultSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", "https:", "data:"],
  mediaSrc: ["'self'", "https:"],
  fontSrc: ["'self'"],
  scriptSrc: ["'self'"],
  frameAncestors: ["'none'"]
}
if (!config.isProduction) {
  // Disable HTTPS upgrade in development so http://localhost works for local viewing.
  cspDirectives.upgradeInsecureRequests = null
}
app.use(helmet({
  contentSecurityPolicy: { directives: cspDirectives },
  crossOriginEmbedderPolicy: false, // Allow embedding podcast images from external sources
  // Skip HSTS in dev so http://localhost works without Safari forcing HTTPS upgrade.
  strictTransportSecurity: config.isProduction ? undefined : false
}))

// Compression middleware
app.use(compression())

// Apple must be able to fetch this JSON directly on both associated hostnames.
// Keep association and store fallback requests outside the RSS rate limiter.
app.get('/.well-known/apple-app-site-association', universalLinkController.showAssociation)
app.get(['/podhaven/open/podcast', '/podhaven/open/episode'], universalLinkController.openApp)

// Rate limiting. Prefer Cloudflare's CF-Connecting-IP (always the true client)
// and fall back to req.ip, which is now correct thanks to `trust proxy`.
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers['cf-connecting-ip'] || req.ip
})
app.use(limiter)

// Set up EJS template engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Serve static files (CSS, images, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')))

// Health check (before logging to avoid log spam)
app.get('/health', (req, res) => {
  res.status(200).send('ok')
})

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path} - Query:`, req.query)
  next()
})

// Site root (Artisanal Software studio landing)
app.get('/', siteController.showHome)

// PodHaven marketing landing pages (no validation needed)
app.get('/podhaven', podhavenLandingController.showLanding)
app.get('/podhaven/privacy', podhavenLandingController.showPrivacy)
app.get('/podhaven/recommendations', podhavenLandingController.showRecommendations)
app.get('/podhaven/transcripts', podhavenLandingController.showTranscripts)
app.get('/podhaven/smart-lists', podhavenLandingController.showSmartLists)
app.get('/podhaven/player', podhavenLandingController.showPlayer)
app.get('/podhaven/queue', podhavenLandingController.showQueue)
app.get('/podhaven/library', podhavenLandingController.showLibrary)
app.get('/podhaven/offline', podhavenLandingController.showOffline)
app.get('/podhaven/customization', podhavenLandingController.showCustomization)
app.get('/podhaven/guides', podhavenLandingController.showGuidesIndex)
app.get('/podhaven/guides/getting-started', podhavenLandingController.showGettingStarted)
app.get('/podhaven/guides/settings', podhavenLandingController.showSettingsGuide)
app.get('/podhaven/guides/per-podcast-settings', podhavenLandingController.showPerPodcastSettings)
app.get('/podhaven/guides/training-recommendations', podhavenLandingController.showTrainingRecommendations)
app.get('/podhaven/guides/transcripts', podhavenLandingController.showTranscriptsGuide)
app.get('/podhaven/guides/smart-lists', podhavenLandingController.showSmartListsGuide)
app.get('/podhaven/guides/listening-tactics', podhavenLandingController.showListeningTactics)
app.get('/podhaven/guides/offline-storage', podhavenLandingController.showOfflineStorageGuide)
app.get('/podhaven/guides/sharing-and-widgets', podhavenLandingController.showSharingAndWidgets)

// Routes with validation middleware (RSS-driven deep-link target pages)
app.get('/podhaven/podcast', validateFeedUrl, podcastController.showPodcast)
app.get('/podhaven/episode', validateFeedUrl, validateGuid, episodeController.showEpisode)

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    statusCode: 404,
    errorTitle: 'Page Not Found',
    errorMessage: 'The page you are looking for does not exist.'
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] Unhandled error:`, err)

  res.status(500).render('error', {
    statusCode: 500,
    errorTitle: 'Server Error',
    errorMessage: config.isProduction
      ? 'An unexpected error occurred. Please try again later.'
      : err.message
  })
})

// Start server (only if not being required for testing)
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Podcast server listening on port ${config.port}`)
    console.log(`Environment: ${config.isProduction ? 'production' : 'development'}`)
    console.log(`Visit: http://localhost:${config.port}/podhaven/podcast?feedURL=<your-feed-url>`)
  })
}

module.exports = app
