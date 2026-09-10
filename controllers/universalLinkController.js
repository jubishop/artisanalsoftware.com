const config = require('../config')

const association = {
  applinks: {
    details: [{
      appIDs: ['34TKMKM889.com.artisanalsoftware.PodHaven'],
      components: [
        { '/': '/podhaven/podcast', '?': { feedURL: '?*' } },
        { '/': '/podhaven/episode', '?': { feedURL: '?*', guid: '?*' } },
        { '/': '/podhaven/open/podcast', '?': { feedURL: '?*' } },
        { '/': '/podhaven/open/episode', '?': { feedURL: '?*', guid: '?*' } }
      ]
    }]
  }
}

function showAssociation(req, res) {
  res.set('Cache-Control', 'public, max-age=3600').json(association)
}

function openApp(req, res) {
  // iOS handles associated links before making an HTTP request. Requests that
  // reach this endpoint need the store fallback, without fetching the RSS feed.
  res.set('Cache-Control', 'no-store').redirect(302, config.appStoreUrl)
}

module.exports = { showAssociation, openApp }
