const express = require('express');
const path = require('path');
const podcastController = require('./controllers/podcastController');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Query:`, req.query);
  next();
});

// Routes
app.get('/podhaven/podcast', podcastController.showPodcast);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    statusCode: 404,
    errorTitle: 'Page Not Found',
    errorMessage: 'The page you are looking for does not exist.'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] Unhandled error:`, err);

  res.status(500).render('error', {
    statusCode: 500,
    errorTitle: 'Server Error',
    errorMessage: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message
  });
});

// Start server (only if not being required for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Podcast server listening on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}/podhaven/podcast?feedURL=<your-feed-url>`);
  });
}

module.exports = app;
