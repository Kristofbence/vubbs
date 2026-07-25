# Showcase thumbnails

The showcase carousel currently ships the **fallback**: Instagram post embeds widened
to 340×620 and cut to the top 6. That fixes the truncated username and the badge/action-row
overlap, but it does not fix the load cost — six iframes is still six full Instagram page
loads, each pulling their own JS, CSS and webfonts.

The real fix is static thumbnail cards. Everything needed is below. It could not be done
in the session that wrote this file: the source MP4s live on the VPS, and that environment
had no network access and no ffmpeg.

---

## Step 1 — generate the frames

On the VPS, from wherever the rendered MP4s are:

```bash
mkdir -p thumbs

ffmpeg -i DYvCGgkClU3.mp4 -ss 00:00:03 -vframes 1 -q:v 2 -vf "scale=540:-2" thumbs/DYvCGgkClU3.jpg
ffmpeg -i DYsXI_WEf76.mp4 -ss 00:00:03 -vframes 1 -q:v 2 -vf "scale=540:-2" thumbs/DYsXI_WEf76.jpg
ffmpeg -i DZARfDTKFhw.mp4 -ss 00:00:03 -vframes 1 -q:v 2 -vf "scale=540:-2" thumbs/DZARfDTKFhw.jpg
ffmpeg -i DY_xg0dqdiu.mp4 -ss 00:00:03 -vframes 1 -q:v 2 -vf "scale=540:-2" thumbs/DY_xg0dqdiu.jpg
ffmpeg -i DY7z6L5qDlB.mp4 -ss 00:00:03 -vframes 1 -q:v 2 -vf "scale=540:-2" thumbs/DY7z6L5qDlB.jpg
ffmpeg -i DY4nrPwKjkF.mp4 -ss 00:00:03 -vframes 1 -q:v 2 -vf "scale=540:-2" thumbs/DY4nrPwKjkF.jpg
```

Filenames must match the post IDs — the markup below expects `thumbs/<POST_ID>.jpg`.

Adjust `-ss` per clip if 3s lands on a weak frame. Pick a face or clear action; a frame that
is mostly the screenplay text panel reads as grey noise at card size.

Check sizes, target under 80KB each:

```bash
ls -lhS thumbs/*.jpg
# anything heavy:
jpegoptim --max=82 --strip-all thumbs/*.jpg
```

Commit the JPEGs to `thumbs/` in this repo.

## Step 2 — swap the CSS

In `index.html`, replace the `.ig-card` / `.ig-badge` block under `/* ── SHOWCASE ── */`:

```css
.ig-card{flex:0 0 270px;aspect-ratio:9/16;scroll-snap-align:start;position:relative;border-radius:var(--r);overflow:hidden;background:#0a0a14;box-shadow:var(--sh);display:block;transition:transform .25s ease;}
.ig-card img{width:100%;height:100%;object-fit:cover;display:block;}
.ig-card::after{content:'';position:absolute;left:0;right:0;bottom:0;height:35%;background:linear-gradient(0deg,rgba(0,0,0,0.55),transparent);pointer-events:none;}
.ig-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:40px;z-index:10;fill:rgba(255,255,255,.7);filter:drop-shadow(0 2px 8px rgba(0,0,0,.45));pointer-events:none;}
.ig-badge{position:absolute;bottom:12px;left:12px;z-index:20;background:var(--text);color:var(--lime);font-family:var(--ff-head);font-weight:700;font-size:11px;padding:5px 12px;border-radius:20px;pointer-events:none;}
@media (hover:hover){.ig-card:hover{transform:scale(1.02);}}
```

And in the `@media (max-width:860px)` block, replace the `.ig-card` override with:

```css
.ig-card{flex:0 0 200px;}
```

(No height — `aspect-ratio` handles it at every width.)

The `.ig-row` container rules stay exactly as they are: `overflow-x`, scroll snap,
drag-to-scroll and the lime scrollbar all still apply.

## Step 3 — swap the markup

Replace the six `<div class="ig-card">…</div>` rows inside `<div class="ig-row">`:

```html
<a class="ig-card" role="listitem" href="https://www.instagram.com/p/DYvCGgkClU3/" target="_blank" rel="noopener noreferrer" aria-label="Instagram post — 4.6M views"><img src="thumbs/DYvCGgkClU3.jpg" alt="" loading="lazy" width="540" height="960"><svg class="ig-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><div class="ig-badge">4.6M views</div></a>
<a class="ig-card" role="listitem" href="https://www.instagram.com/p/DYsXI_WEf76/" target="_blank" rel="noopener noreferrer" aria-label="Instagram post — 4.4M views"><img src="thumbs/DYsXI_WEf76.jpg" alt="" loading="lazy" width="540" height="960"><svg class="ig-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><div class="ig-badge">4.4M views</div></a>
<a class="ig-card" role="listitem" href="https://www.instagram.com/p/DZARfDTKFhw/" target="_blank" rel="noopener noreferrer" aria-label="Instagram post — 472K views"><img src="thumbs/DZARfDTKFhw.jpg" alt="" loading="lazy" width="540" height="960"><svg class="ig-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><div class="ig-badge">472K views</div></a>
<a class="ig-card" role="listitem" href="https://www.instagram.com/p/DY_xg0dqdiu/" target="_blank" rel="noopener noreferrer" aria-label="Instagram post — 204K views"><img src="thumbs/DY_xg0dqdiu.jpg" alt="" loading="lazy" width="540" height="960"><svg class="ig-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><div class="ig-badge">204K views</div></a>
<a class="ig-card" role="listitem" href="https://www.instagram.com/p/DY7z6L5qDlB/" target="_blank" rel="noopener noreferrer" aria-label="Instagram post — 166K views"><img src="thumbs/DY7z6L5qDlB.jpg" alt="" loading="lazy" width="540" height="960"><svg class="ig-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><div class="ig-badge">166K views</div></a>
<a class="ig-card" role="listitem" href="https://www.instagram.com/p/DY4nrPwKjkF/" target="_blank" rel="noopener noreferrer" aria-label="Instagram post — 112K views"><img src="thumbs/DY4nrPwKjkF.jpg" alt="" loading="lazy" width="540" height="960"><svg class="ig-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><div class="ig-badge">112K views</div></a>
```

`width`/`height` on the `<img>` are the intrinsic 9:16 dimensions at `scale=540:-2` — they
reserve layout space so nothing shifts as the images arrive. If a clip is not 9:16, correct
the numbers for that card.

Adding the other six posts back is one more `<a>` each, same shape. The descending sort
matters: leading on the two 4M+ posts is the strongest opening.

## Step 4 — verify

- 1440×900 and 390×844
- Row scrolls; the page does not overflow horizontally
- Badge legible on light *and* dark thumbnails — the gradient is what buys this, check a
  bright frame specifically
- Cards open the right post in a new tab
- Scroll snapping and desktop drag-to-scroll still work
- Compare load time against the current embed version

---

## Restoring the other six posts

Cut from the carousel when it moved to the fallback, in descending order:

| Post | Views |
|---|---|
| `DY10ilAKwcG` | 100K |
| `DYzqA0UCTR0` | 79.6K |
| `DYwwkVUjABa` | 70K |
| `DYo68JEHT5f` | 56.5K |
| `DYmqnWaAH1m` | 51.7K |
| `DY2E8Rrqkmk` | 51.1K |
