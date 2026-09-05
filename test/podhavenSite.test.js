const request = require('supertest')
const { expect } = require('chai')
const app = require('../app')

describe('PodHaven feature site', function () {
  for (const route of ['transcripts', 'smart-lists', 'guides/transcripts', 'guides/smart-lists']) {
    it(`serves /podhaven/${route} with a canonical URL and guide navigation`, async function () {
      const response = await request(app).get(`/podhaven/${route}`).expect(200)
      expect(response.text).to.include(`rel="canonical" href="https://artisanalsoftware.com/podhaven/${route}"`)
      expect(response.text).to.include('href="/podhaven/guides"')
      expect(response.text).not.to.match(/<script\b/i)
    })
  }

  it('connects the homepage to transcripts and Smart Lists', async function () {
    const response = await request(app).get('/podhaven').expect(200)
    expect(response.text).to.include('href="/podhaven/transcripts"')
    expect(response.text).to.include('href="/podhaven/smart-lists"')
  })

  it('keeps every feature and guide reachable with valid local links and images', async function () {
    const paths = [
      '/podhaven', '/podhaven/recommendations', '/podhaven/transcripts',
      '/podhaven/smart-lists', '/podhaven/player', '/podhaven/queue',
      '/podhaven/library', '/podhaven/offline', '/podhaven/customization',
      '/podhaven/guides', '/podhaven/guides/getting-started',
      '/podhaven/guides/settings', '/podhaven/guides/per-podcast-settings',
      '/podhaven/guides/training-recommendations', '/podhaven/guides/transcripts',
      '/podhaven/guides/smart-lists', '/podhaven/guides/listening-tactics',
      '/podhaven/guides/offline-storage', '/podhaven/guides/sharing-and-widgets'
    ]
    const pages = new Map()
    for (const path of paths) {
      const response = await request(app).get(path).expect(200)
      pages.set(path, response.text)
      expect(response.text.match(/<h1\b/g), path).to.have.length(1)
      expect(response.text, path).to.include('id="main"')
      expect(response.text, path).not.to.match(/<script\b/i)
      expect(response.text, path).not.to.include('App screenshot to be added')
      expect(response.text, path).to.include(`rel="canonical" href="https://artisanalsoftware.com${path}"`)
    }
    const assets = new Set()
    for (const [path, html] of pages) {
      for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
        if (!href.startsWith('/') && !href.startsWith('#')) continue
        const url = new URL(href, `https://artisanalsoftware.com${path}`)
        if (url.pathname.startsWith('/public/')) {
          assets.add(url.pathname)
        } else if (url.pathname.startsWith('/podhaven')) {
          expect(pages.has(url.pathname), `${path} links to missing ${url.pathname}`).to.equal(true)
          if (url.hash) expect(pages.get(url.pathname)).to.include(`id="${url.hash.slice(1)}"`)
        }
      }
      for (const [tag, src] of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)) {
        expect(tag, `${path} image needs an alt attribute`).to.match(/\balt="[^"]*"/)
        assets.add(new URL(src, 'https://artisanalsoftware.com').pathname)
      }
    }
    for (const asset of assets) await request(app).get(asset).expect(200)
  })

  it('uses clearly labeled placeholders without broken image requests for missing captures', async function () {
    const ejs = require('ejs')
    const path = require('path')
    const html = await ejs.renderFile(path.join(__dirname, '../views/podhaven/partials/screenshot.ejs'), {
      id: 'missing-capture',
      screenshots: { 'missing-capture': { title: 'A transcript', src: null } }
    })
    expect(html).to.include('data-screenshot="missing-capture"')
    expect(html).to.include('App screenshot to be added')
    expect(html).not.to.include('<img')
  })

  it('keeps the studio homepage on its original stylesheet', async function () {
    const response = await request(app).get('/').expect(200)
    expect(response.text).to.include('/public/css/podhavenLanding.css?v=')
    expect(response.text).not.to.include('/public/css/podhaven.css')
  })
})
