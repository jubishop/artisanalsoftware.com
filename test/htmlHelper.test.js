const { expect } = require('chai')
const {
  stripHtml,
  createMetaDescription,
  createOgDescription,
  processTimestamps,
  timestampToSeconds,
  secondsToTimestamp
} = require('../services/htmlHelper')

describe('HTML Helper Service', function() {
  describe('timestampToSeconds', function() {
    it('should convert MM:SS format to seconds', function() {
      expect(timestampToSeconds('1:30')).to.equal(90)
      expect(timestampToSeconds('15:30')).to.equal(930)
      expect(timestampToSeconds('0:45')).to.equal(45)
    })

    it('should convert HH:MM:SS format to seconds', function() {
      expect(timestampToSeconds('1:23:45')).to.equal(5025)
      expect(timestampToSeconds('01:23:45')).to.equal(5025)
      expect(timestampToSeconds('0:00:30')).to.equal(30)
    })

    it('should handle edge cases', function() {
      expect(timestampToSeconds('0:00')).to.equal(0)
      expect(timestampToSeconds('99:59')).to.equal(5999)
    })
  })

  describe('secondsToTimestamp', function() {
    it('should format seconds under a minute as M:SS', function() {
      expect(secondsToTimestamp(0)).to.equal('0:00')
      expect(secondsToTimestamp(5)).to.equal('0:05')
      expect(secondsToTimestamp(45)).to.equal('0:45')
    })

    it('should format seconds under an hour as M:SS', function() {
      expect(secondsToTimestamp(90)).to.equal('1:30')
      expect(secondsToTimestamp(930)).to.equal('15:30')
      expect(secondsToTimestamp(3599)).to.equal('59:59')
    })

    it('should format seconds at or above an hour as H:MM:SS', function() {
      expect(secondsToTimestamp(3600)).to.equal('1:00:00')
      expect(secondsToTimestamp(3725)).to.equal('1:02:05')
      expect(secondsToTimestamp(5025)).to.equal('1:23:45')
    })

    it('should be the inverse of timestampToSeconds for common values', function() {
      const cases = ['0:00', '0:45', '1:30', '15:30', '1:02:05', '1:23:45']
      for (const ts of cases) {
        expect(secondsToTimestamp(timestampToSeconds(ts))).to.equal(ts)
      }
    })

    it('should coerce invalid or negative input to 0:00', function() {
      expect(secondsToTimestamp(-10)).to.equal('0:00')
      expect(secondsToTimestamp(null)).to.equal('0:00')
      expect(secondsToTimestamp(undefined)).to.equal('0:00')
      expect(secondsToTimestamp('not a number')).to.equal('0:00')
    })

    it('should truncate fractional seconds', function() {
      expect(secondsToTimestamp(90.9)).to.equal('1:30')
    })
  })

  describe('processTimestamps', function() {
    const baseUrl = '/podhaven/episode?feedURL=test&guid=123'

    it('should convert MM:SS timestamps to links', function() {
      const html = 'Check out the intro at 1:30'
      const result = processTimestamps(html, baseUrl)

      expect(result).to.include('<a href="')
      expect(result).to.include('startTime=90')
      expect(result).to.include('class="timestamp-link"')
      expect(result).to.include('>1:30</a>')
    })

    it('should convert HH:MM:SS timestamps to links', function() {
      const html = 'The interview starts at 1:23:45'
      const result = processTimestamps(html, baseUrl)

      expect(result).to.include('startTime=5025')
      expect(result).to.include('>1:23:45</a>')
    })

    it('should convert multiple timestamps', function() {
      const html = 'Topics: 0:00 Intro, 5:30 Topic 1, 1:15:00 Topic 2'
      const result = processTimestamps(html, baseUrl)

      expect(result).to.include('startTime=0')
      expect(result).to.include('startTime=330')
      expect(result).to.include('startTime=4500')
    })

    it('should not process timestamps inside HTML tags', function() {
      const html = '<a href="http://example.com/page?time=1:30">Link</a>'
      const result = processTimestamps(html, baseUrl)

      // The timestamp in the href should not be wrapped in another link
      expect(result).to.equal(html)
    })

    it('should handle timestamps in mixed HTML content', function() {
      const html = '<p>Start at 2:30 for the good part.</p><div>Also check 10:00.</div>'
      const result = processTimestamps(html, baseUrl)

      expect(result).to.include('startTime=150')
      expect(result).to.include('startTime=600')
      expect(result).to.include('<p>')
      expect(result).to.include('</p>')
    })

    it('should return unchanged for null or empty input', function() {
      expect(processTimestamps(null, baseUrl)).to.be.null
      expect(processTimestamps('', baseUrl)).to.equal('')
    })

    it('should return unchanged when no timestamps found', function() {
      const html = 'No timestamps here, just plain text.'
      const result = processTimestamps(html, baseUrl)

      expect(result).to.equal(html)
    })

    it('should not match partial timestamps like IP addresses', function() {
      const html = 'Server is at 192.168.1.1 address'
      const result = processTimestamps(html, baseUrl)

      // Should not convert any part of IP address
      expect(result).to.not.include('timestamp-link')
    })

    it('should not match times followed by more colons', function() {
      const html = 'The ratio is 1:30:60:90'
      const result = processTimestamps(html, baseUrl)

      // Should not match invalid patterns
      expect(result).to.not.include('timestamp-link')
    })

    it('should use & separator when URL already has query params', function() {
      const html = 'Start at 1:00'
      const result = processTimestamps(html, baseUrl)

      expect(result).to.include('&startTime=60')
    })

    it('should use ? separator when URL has no query params', function() {
      const html = 'Start at 1:00'
      const result = processTimestamps(html, '/podhaven/episode')

      expect(result).to.include('?startTime=60')
    })
  })

  describe('stripHtml', function() {
    it('should strip HTML tags from content', function() {
      const html = '<p>Hello <strong>world</strong></p>'
      expect(stripHtml(html)).to.equal('Hello world')
    })

    it('should handle empty input', function() {
      expect(stripHtml('')).to.equal('')
      expect(stripHtml(null)).to.equal('')
    })
  })

  describe('createMetaDescription', function() {
    it('should strip HTML and truncate long content', function() {
      const html = '<p>' + 'A'.repeat(200) + '</p>'
      const result = createMetaDescription(html)

      expect(result.length).to.be.lessThanOrEqual(163) // 160 + '...'
      expect(result).to.not.include('<p>')
    })

    it('should not truncate short content', function() {
      const html = '<p>Short description</p>'
      const result = createMetaDescription(html)

      expect(result).to.equal('Short description')
    })
  })
})
