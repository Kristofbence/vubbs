// Renders og/og-image.html to og-image.jpg (1200x630) in the repo root.
//
//   npm i -D playwright && npx playwright install chromium
//   node og/build.js
//
// Must run on a machine with network access — the template pulls Syne and
// JetBrains Mono from Google Fonts, and the whole point of the image is that
// the type is right. The script fails loudly rather than silently shipping a
// fallback-font image.

const path = require('path');
const { chromium } = require('playwright');

const SRC = 'file://' + path.resolve(__dirname, 'og-image.html');
const OUT = path.resolve(__dirname, '..', 'og-image.jpg');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2, // render at 2x, then downsample on save
  });

  const failed = [];
  page.on('requestfailed', r => failed.push(r.url()));

  await page.goto(SRC, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const syne = await page.evaluate(() => document.fonts.check('800 92px Syne'));
  if (!syne || failed.some(u => u.includes('fonts.'))) {
    await browser.close();
    console.error('Syne did not load — refusing to write an off-brand image.');
    failed.forEach(u => console.error('  failed: ' + u));
    process.exit(1);
  }

  await page.screenshot({ path: OUT, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();

  const kb = Math.round(require('fs').statSync(OUT).size / 1024);
  console.log(`wrote ${OUT} (${kb}KB)`);
  if (kb > 300) console.warn('over the 300KB target — drop quality or run it through an optimiser');
})();
