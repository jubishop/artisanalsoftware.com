const request = require('supertest')
const { expect } = require('chai')
const app = require('../app')

// The limiter keeps one in-memory window per process, so each test uses its own addresses.
function remaining(clientIp) {
  return request(app).get('/health').set('CF-Connecting-IP', clientIp)
    .expect(200)
    .then((res) => Number(res.headers['ratelimit-remaining']))
}

describe('Rate limiting', function() {
  it('counts addresses within one IPv6 /56 allocation together', async function() {
    const first = await remaining('2001:db8:4a:1::1')
    const second = await remaining('2001:db8:4a:2::99')
    expect(second).to.equal(first - 1)
  })

  it('keeps separate IPv6 allocations and IPv4 clients apart', async function() {
    const first = await remaining('2001:db8:4b:1::1')
    expect(await remaining('2001:db8:4c:1::1')).to.equal(first)
    expect(await remaining('192.0.2.10')).to.equal(first)
    expect(await remaining('192.0.2.11')).to.equal(first)
  })
})
