const config = require('../config')

const baseUrl = config.baseUrl

function showHome(req, res) {
  res.render('home', {
    baseUrl,
    canonicalPath: '/',
    pageTitle: 'Artisanal Software — Quiet, considered software for people who notice',
    pageDescription: 'Artisanal Software is an independent studio building thoughtful, privacy-first software. Maker of PodHaven, an iOS podcast app with on-device recommendations.',
    ogImage: '/public/images/podhaven/episode-detail.png'
  })
}

module.exports = { showHome }
