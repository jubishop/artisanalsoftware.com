---
status: current
---

# Universal Links rollout

This runbook describes how to enable HTTPS links that open the PodHaven app.
The current Railway flag and App Store build must be checked before activation.

Both `artisanalsoftware.com` and `www.artisanalsoftware.com` serve Apple's
association file at `/.well-known/apple-app-site-association`. It associates
only the production PodHaven app (`34TKMKM889.com.artisanalsoftware.PodHaven`)
with podcast and episode links. Marketing pages stay in the browser.

The app must include both hosts in its Associated Domains entitlement and
handle the HTTPS URLs through its share service. SwiftUI delivers these URLs
through the existing `onOpenURL` handler.

Deploy the website setup before distributing the compatible app build. Keep
`PODHAVEN_UNIVERSAL_LINKS_ENABLED` unset until that build is available in the
App Store. Then set it to `true` in Railway and redeploy. This switches the
page buttons from `podhaven://` to `/podhaven/open/podcast` and
`/podhaven/open/episode` on the other associated hostname. Using the other
hostname allows Safari to open the app from either website hostname.

If iOS does not open the app, these endpoints redirect to PodHaven's App Store
page. The normal `/podhaven/podcast` and `/podhaven/episode` URLs still render
web content when the app does not open. Browser preferences, unsupported
browsers, and older app builds can also cause the web fallback.

Before activating the buttons, verify both association URLs return JSON with
HTTP 200 and no redirect, and test a compatible installed build on a physical
device: tap links from Notes and from both website hosts, check podcast,
episode, and timestamp navigation, and check the App Store fallback on a device
without PodHaven. Apple's association cache can delay changes after deployment.

Set `PODHAVEN_UNIVERSAL_LINKS_ENABLED=false` and redeploy to restore the old
buttons. The association file and fallback endpoints remain available.

See [Apple's Universal Links troubleshooting guide](https://developer.apple.com/documentation/technotes/tn3155-debugging-universal-links).

