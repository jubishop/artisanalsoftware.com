const express = require('express')
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const config = require('./config')
const podcastController = require('./controllers/podcastController')
const episodeController = require('./controllers/episodeController')
const { validateFeedUrl, validateGuid } = require('./middleware/validateFeedUrl')

const app = express()

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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "https:", "data:"],
      mediaSrc: ["'self'", "https:"],
      fontSrc: ["'self'"],
      scriptSrc: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false // Allow embedding podcast images from external sources
}))

// Compression middleware
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
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

// Routes with validation middleware
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
