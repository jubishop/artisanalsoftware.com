const config = require('../config')

const baseUrl = config.baseUrl

const pages = {
  landing: {
    template: 'podhaven/landing',
    activePage: 'landing',
    canonicalPath: '/podhaven',
    pageTitle: 'PodHaven — Your Personal Podcast Hub',
    pageDescription: 'PodHaven is a modern iOS podcast app with on-device recommendations, customizable playback, smart queues, and offline listening.',
    ogImage: '/public/images/podhaven/episode-detail.png'
  },
  recommendations: {
    template: 'podhaven/recommendations',
    activePage: 'recommendations',
    canonicalPath: '/podhaven/recommendations',
    pageTitle: 'PodHaven Recommendations — On-device, four-way ratings, reasons-why',
    pageDescription: 'Four-way ratings train an on-device recommendation engine. Picks come with a reason and a Recommendation score. Nothing leaves your phone.',
    ogImage: '/public/images/podhaven/episode-detail.png'
  },
  player: {
    template: 'podhaven/player',
    activePage: 'player',
    canonicalPath: '/podhaven/player',
    pageTitle: 'PodHaven Player — Skip intervals, chapters, Undo Seek, AirPlay',
    pageDescription: 'A player built for serious listeners. Custom skip intervals, playback speed, chapter navigation, Undo Seek, AirPlay, and a configurable Next button.',
    ogImage: '/public/images/podhaven/settings-playback.png'
  },
  queue: {
    template: 'podhaven/queue',
    activePage: 'queue',
    canonicalPath: '/podhaven/queue',
    pageTitle: 'PodHaven Queue — Drag-to-reorder, multi-select, auto-play recommendations',
    pageDescription: 'Up Next is a real queue with drag-to-reorder, configurable max length, multi-select batch actions, and auto-play of the top recommendation when the queue empties.',
    ogImage: '/public/images/podhaven/episodes-list.png'
  },
  library: {
    template: 'podhaven/library',
    activePage: 'library',
    canonicalPath: '/podhaven/library',
    pageTitle: 'PodHaven Library — iTunes search, OPML, share extension, custom tags',
    pageDescription: 'iTunes search, Apple Top Podcasts and seventeen genre charts, manual RSS, OPML import / export, a share extension that subscribes from Safari, and custom tags.',
    ogImage: '/public/images/podhaven/search-trending.png'
  },
  offline: {
    template: 'podhaven/offline',
    activePage: 'offline',
    canonicalPath: '/podhaven/offline',
    pageTitle: 'PodHaven Offline — Smart cache, auto-download, save important episodes',
    pageDescription: 'Smart cache from 0.5 GB to 20 GB. Save important episodes so they\'re never evicted. Auto-download new episodes per podcast.',
    ogImage: '/public/images/podhaven/episode-detail.png'
  },
  customization: {
    template: 'podhaven/customization',
    activePage: 'customization',
    canonicalPath: '/podhaven/customization',
    pageTitle: 'PodHaven Customization — Settings, appearance, widgets',
    pageDescription: 'Light / Dark / System appearance, time-remaining vs total, shrink-on-scroll Play Bar, configurable Next button, widgets with playback intents.',
    ogImage: '/public/images/podhaven/settings-playback.png'
  },
  guidesIndex: {
    template: 'podhaven/guides/index',
    activePage: 'guides',
    canonicalPath: '/podhaven/guides',
    pageTitle: 'PodHaven Guides — Getting started, settings, recommendations, queue, offline',
    pageDescription: 'Practical guides for PodHaven: first-launch checklist, every setting explained, per-podcast settings, training recommendations, queue tactics, offline strategy, sharing and widgets.',
    ogImage: '/public/images/podhaven/settings-playback.png'
  },
  gettingStarted: {
    template: 'podhaven/guides/getting-started',
    activePage: 'guides',
    canonicalPath: '/podhaven/guides/getting-started',
    pageTitle: 'PodHaven Guide — Getting Started',
    pageDescription: 'Five-minute first-launch checklist for PodHaven: import OPML, set skip intervals and defaults, allow notifications, train recommendations.',
    ogImage: '/public/images/podhaven/settings.png'
  },
  settingsGuide: {
    template: 'podhaven/guides/settings',
    activePage: 'guides',
    canonicalPath: '/podhaven/guides/settings',
    pageTitle: 'PodHaven Guide — Every Setting Explained',
    pageDescription: 'Walk-through of every toggle, slider, and picker on the PodHaven Settings page.',
    ogImage: '/public/images/podhaven/settings-playback.png'
  },
  perPodcastSettings: {
    template: 'podhaven/guides/per-podcast-settings',
    activePage: 'guides',
    canonicalPath: '/podhaven/guides/per-podcast-settings',
    pageTitle: 'PodHaven Guide — Per-Podcast Settings',
    pageDescription: 'Per-podcast playback rate, auto-queue strategy, cache strategy, freshness cadence for recommendations, and per-podcast notifications.',
    ogImage: '/public/images/podhaven/podcast-settings.png'
  },
  trainingRecommendations: {
    template: 'podhaven/guides/training-recommendations',
    activePage: 'guides',
    canonicalPath: '/podhaven/guides/training-recommendations',
    pageTitle: 'PodHaven Guide — Train the Recommendation Engine',
    pageDescription: 'How to rate strategically, when to use Not Interested, what the Recommendation score means, and how to course-correct.',
    ogImage: '/public/images/podhaven/episode-detail.png'
  },
  listeningTactics: {
    template: 'podhaven/guides/listening-tactics',
    activePage: 'guides',
    canonicalPath: '/podhaven/guides/listening-tactics',
    pageTitle: 'PodHaven Guide — Queue, Gestures &amp; Multi-Select',
    pageDescription: 'Drag-to-reorder, swipe shortcuts, long-press context menus, multi-select edit mode, sorting, and the small tap targets you might miss.',
    ogImage: '/public/images/podhaven/episodes-list.png'
  },
  offlineStorageGuide: {
    template: 'podhaven/guides/offline-storage',
    activePage: 'guides',
    canonicalPath: '/podhaven/guides/offline-storage',
    pageTitle: 'PodHaven Guide — Offline &amp; Storage Strategy',
    pageDescription: 'Cache vs Save mental model, picking a cache budget, auto-download per podcast, and how PodHaven keeps your storage sane.',
    ogImage: '/public/images/podhaven/episode-detail.png'
  },
  sharingAndWidgets: {
    template: 'podhaven/guides/sharing-and-widgets',
    activePage: 'guides',
    canonicalPath: '/podhaven/guides/sharing-and-widgets',
    pageTitle: 'PodHaven Guide — Sharing, Widgets &amp; Notifications',
    pageDescription: 'Deep links, the share extension, Home Screen widgets with playback intents, and per-podcast notifications.',
    ogImage: '/public/images/podhaven/podcast-episodes.png'
  }
}

function makeRenderer(key) {
  return function (req, res) {
    const page = pages[key]
    res.render(page.template, {
      baseUrl,
      activePage: page.activePage,
      canonicalPath: page.canonicalPath,
      pageTitle: page.pageTitle,
      pageDescription: page.pageDescription,
      ogImage: page.ogImage
    })
  }
}

module.exports = {
  showLanding: makeRenderer('landing'),
  showRecommendations: makeRenderer('recommendations'),
  showPlayer: makeRenderer('player'),
  showQueue: makeRenderer('queue'),
  showLibrary: makeRenderer('library'),
  showOffline: makeRenderer('offline'),
  showCustomization: makeRenderer('customization'),
  showGuidesIndex: makeRenderer('guidesIndex'),
  showGettingStarted: makeRenderer('gettingStarted'),
  showSettingsGuide: makeRenderer('settingsGuide'),
  showPerPodcastSettings: makeRenderer('perPodcastSettings'),
  showTrainingRecommendations: makeRenderer('trainingRecommendations'),
  showListeningTactics: makeRenderer('listeningTactics'),
  showOfflineStorageGuide: makeRenderer('offlineStorageGuide'),
  showSharingAndWidgets: makeRenderer('sharingAndWidgets')
}
