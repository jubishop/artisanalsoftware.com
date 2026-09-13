---
status: current
---

# PodHaven website content

The `/podhaven` website includes eight feature pages and nine guides. Feature
copy is in `content/podhaven-features.js`; guide copy is in
`content/podhaven-guides.js`. They share the `views/podhaven/detail.ejs` template.
Existing feature and guide URLs remain supported.

Screenshot captions, alt text, and capture instructions live in
`content/podhaven-screenshots.js`. New captures go in
`public/images/podhaven/screenshots/<id>.png` (`.jpeg` and `.jpg` also work; PNG takes priority). Restart the server after adding
captures or changing content modules. All 24 screenshot slots use supplied
full-resolution originals. Features without screenshots remain covered in the
page text and guides.

- [Feature accounting and source evidence](podhaven-feature-audit.md)
- [Screenshot inventory and capture instructions](podhaven-screenshots.md)

PodHaven uses `public/css/podhaven.css`. The studio homepage retains its separate
`public/css/podhavenLanding.css` styles. Both are server-rendered without client-side
JavaScript.


The feature audit is dated evidence. Check the current PodHaven source before
changing feature claims. Restart the server after changing content, controllers,
or reused asset contents; asset hashes are cached for the process lifetime.
