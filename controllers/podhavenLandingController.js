const fs = require('fs')
const path = require('path')
const config = require('../config')
const features = require('../content/podhaven-features')
const guides = require('../content/podhaven-guides')
const screenshotInventory = require('../content/podhaven-screenshots')

const screenshots = Object.fromEntries(screenshotInventory.map(shot => {
  const replacement = ['png', 'jpeg', 'jpg']
    .map(extension => `/public/images/podhaven/screenshots/${shot.id}.${extension}`)
    .find(candidate => fs.existsSync(path.join(__dirname, '..', candidate)))
  const src = replacement || (shot.current ? `/public/images/podhaven/${shot.current}` : null)
  return [shot.id, { ...shot, src }]
}))

function render(res, template, page, canonicalPath, activePage) {
  res.render(template, {
    baseUrl: config.baseUrl,
    page,
    features,
    guides,
    screenshots,
    activePage,
    canonicalPath,
    pageTitle: `${page.label} — PodHaven`,
    pageDescription: page.description,
    ogImage: '/public/images/podhaven/recommended-episode-detail.png'
  })
}

function feature(key) {
  return (req, res) => render(res, 'podhaven/detail', features[key], `/podhaven/${key}`, key)
}

function guide(key) {
  return (req, res) => render(res, 'podhaven/detail', guides[key], `/podhaven/guides/${key}`, 'guides')
}

module.exports = {
  showLanding: (req, res) => render(res, 'podhaven/landing', {
    label: 'Podcasts, at your pace',
    description: 'Meet PodHaven: recommendations powered entirely on your device, Smart Lists and flexible filters, and extensive settings to make listening your own.'
  }, '/podhaven', 'landing'),
  showGuidesIndex: (req, res) => render(res, 'podhaven/guides/index', {
    label: 'Guides',
    description: 'Get more from PodHaven with guides to on-device recommendations, Smart Lists and filters, customization, playback, offline listening, and transcripts.'
  }, '/podhaven/guides', 'guides'),
  showRecommendations: feature('recommendations'),
  showTranscripts: feature('transcripts'),
  showSmartLists: feature('smart-lists'),
  showPlayer: feature('player'),
  showQueue: feature('queue'),
  showLibrary: feature('library'),
  showOffline: feature('offline'),
  showCustomization: feature('customization'),
  showGettingStarted: guide('getting-started'),
  showSettingsGuide: guide('settings'),
  showPerPodcastSettings: guide('per-podcast-settings'),
  showTrainingRecommendations: guide('training-recommendations'),
  showTranscriptsGuide: guide('transcripts'),
  showSmartListsGuide: guide('smart-lists'),
  showListeningTactics: guide('listening-tactics'),
  showOfflineStorageGuide: guide('offline-storage'),
  showSharingAndWidgets: guide('sharing-and-widgets')
}
