# vubbs.com

Single-page static site. Everything lives in `index.html` — markup, CSS in one
`<style>` block, and the scroll/fade JS at the bottom. No build step, no framework.

## Workflow — commit straight to main

**Push to `main`. Do not create feature branches.** One person works on this repo,
and GitHub Pages deploys from `main` (`.github/workflows/static.yml`, on push).
Anything sitting on a branch never goes live.

**Verify against the live site before reporting a task done.** Fetch
<https://vubbs.com> and confirm the change is actually being served — a green
Actions run is not the same as the page having changed. If the live page still
shows the old values, say the deploy didn't land rather than reporting success.

Some sandboxes block outbound requests to vubbs.com. If the fetch fails, say the
verification could not be performed — do not substitute the workflow run's status
and call it verified.

## House rules

- Match the surrounding style: CSS custom properties from `:root`, existing token
  names (`--lime`, `--r`, `--sh`, `--ff-head`), no new dependencies.
- `.fi` on an element opts it into the IntersectionObserver fade-in.
- Instagram embeds are cross-origin — their internals cannot be restyled. Contain
  them in a card and size the iframe explicitly; they do not self-size.
- Don't invent metrics. The view counts and the `25M+ views` proof line are real
  figures; if a number appears in more than one place, update every instance.
