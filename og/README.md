# og-image.jpg

`index.html` references `https://vubbs.com/og-image.jpg` from `og:image` and
`twitter:image`. **That file does not exist in the repo yet.** Generate it before
the site goes live, or every share renders imageless — which is the leak the tags
were added to close.

```bash
npm i -D playwright
npx playwright install chromium
node og/build.js
```

Writes `og-image.jpg` (1200×630) to the repo root. Commit it.

## Why it isn't already committed

The session that wrote this had no network access, so Google Fonts was unreachable
and Syne could not load. The image is mostly a typographic composition in Syne 800 —
rendering it in a fallback face would have shipped an off-brand asset that looks
close enough to go unnoticed. `build.js` checks `document.fonts.check('800 92px Syne')`
and exits non-zero rather than writing that file.

The composition itself is verified: off-white ground with the hero's lime radial
glow, `vubbs.` wordmark, the headline with `social post.` on a lime highlight, the
five platform icons (lifted from `index.html`, so they stay in sync with the page),
and the `25M+ views generated` proof line already claimed in the hero.

## Editing

`og-image.html` is a plain 1200×630 page — open it in a browser to iterate. It
reuses the site's tokens (`--lime`, `--text`, `--bg2`, `--ff-head`), so it tracks
the brand as long as those values match `index.html`.

Watch the headline: at 92px Syne sets tighter than the fallback, so the line breaks
may land differently than they do without the webfont. Check the rendered JPEG, not
the HTML in a fontless environment.

`build.js` renders at `deviceScaleFactor: 2` and saves at JPEG quality 90 — typically
well under the 300KB target. It warns if the output exceeds it.

## If the numbers change

`25M+ views generated` appears in three places that must agree: the hero
`.proof-line` in `index.html`, the `<meta name="description">`, and `og-image.html`.
Update all three together.
