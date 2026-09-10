const request = require('supertest')
const { expect } = require('chai')
const path = require('path')
const app = require('../app')
const config = require('../config')
const { generatePodcastLink, generateEpisodeLink } = require('../services/urlHelper')

describe('PodHaven Universal Links', function() {
  const storeURL = 'https://apps.apple.com/us/app/podhaven/id6744904018'
  const originalEnabled = config.universalLinksEnabled

  beforeEach(function() { config.universalLinksEnabled = true })
  afterEach(function() { config.universalLinksEnabled = originalEnabled })

  for (const host of ['artisanalsoftware.com', 'www.artisanalsoftware.com']) {
    it(`serves Apple's association file directly on ${host}`, async function() {
      const response = await request(app)
        .get('/.well-known/apple-app-site-association')
        .set('Host', host)
        .expect('Content-Type', /application\/json/)
        .expect(200)
      expect(response.headers.location).to.equal(undefined)
      const details = response.body.applinks.details
      expect(details).to.have.length(1)
      expect(details[0].appIDs).to.deep.equal(['34TKMKM889.com.artisanalsoftware.PodHaven'])
      expect(details[0].components.map(component => component['/'])).to.deep.equal([
        '/podhaven/podcast', '/podhaven/episode',
        '/podhaven/open/podcast', '/podhaven/open/episode'
      ])
    })

    for (const kind of ['podcast', 'episode']) {
      it(`falls back to the App Store for ${kind} links on ${host}`, async function() {
        const response = await request(app)
          .get(`/podhaven/open/${kind}`)
          .set('Host', host)
          .query({ feedURL: 'https://invalid.example/feed', guid: 'a', url: 'https://evil.example' })
          .expect(302)
        expect(response.headers.location).to.equal(storeURL)
        expect(response.headers['cache-control']).to.equal('no-store')
      })
    }

    it(`renders buttons that leave ${host} for the other associated host`, async function() {
      const feedURL = 'file://' + path.join(__dirname, 'fixtures', 'sample-valid-feed.xml')
      const response = await request(app).get('/podhaven/podcast')
        .set('Host', host).query({ feedURL }).expect(200)
      const otherHost = host.startsWith('www.') ? 'artisanalsoftware.com' : 'www.artisanalsoftware.com'
      expect(response.text).to.include(`href="https://${otherHost}/podhaven/open/podcast?`)
      expect(response.text).to.include(`href="https://${otherHost}/podhaven/open/episode?`)
      expect(response.text).not.to.include('podhaven://')
    })

    it(`preserves the timestamp in the episode page button on ${host}`, async function() {
      const feedURL = 'file://' + path.join(__dirname, 'fixtures', 'sample-valid-feed.xml')
      const response = await request(app).get('/podhaven/episode')
        .set('Host', host).query({ feedURL, guid: '96a6e72c-8513-4130-af49-d269532641ff', startTime: '90' }).expect(200)
      const otherHost = host.startsWith('www.') ? 'artisanalsoftware.com' : 'www.artisanalsoftware.com'
      expect(response.text).to.include(`href="https://${otherHost}/podhaven/open/episode?`)
      expect(response.text).to.include('guid=96a6e72c-8513-4130-af49-d269532641ff&amp;startTime=90')
    })
  }

  it('preserves feed, episode GUID, and time without double decoding', function() {
    const feed = 'https://example.com/feed?a=1&token=a+b%20c'
    const guid = 'https://example.com/episode?id=1&part=2#title'
    const url = new URL(generateEpisodeLink(feed, guid, 90, 'www.artisanalsoftware.com'))
    expect(url.origin).to.equal('https://artisanalsoftware.com')
    expect(url.pathname).to.equal('/podhaven/open/episode')
    expect(url.searchParams.get('feedURL')).to.equal(feed)
    expect(url.searchParams.get('guid')).to.equal(guid)
    expect(url.searchParams.get('startTime')).to.equal('90')
  })

  it('never uses an arbitrary request hostname for generated app links', function() {
    const url = new URL(generatePodcastLink('https://example.com/feed', 'evil.example'))
    expect(url.origin).to.equal('https://www.artisanalsoftware.com')
  })

  it('preserves existing app links until the compatible app release is available', function() {
    config.universalLinksEnabled = false
    expect(generatePodcastLink('https://example.com/feed')).to.match(/^podhaven:\/\/share\?url=/)
    expect(generateEpisodeLink('https://example.com/feed', 'a', 90)).to.match(/^podhaven:\/\/share\?url=/)
  })
})
