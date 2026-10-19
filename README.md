# ORBIT: animated cosmic portfolio, live refinement

Approved effects integrated on 19 October 2026: Blender-rendered black-hole loop with poster/MP4 fallbacks, the original zigzag route with comet wake and checkpoint rays, and an 18px star cursor with a fading trail. Latest refinement slows the black hole to 0.6x, enlarges/tilts it, fixes cursor hover alignment and adds a longer trail with a visible click burst. See `APPROVED_EFFECTS_INTEGRATION.md` for validation and rollback details. The source model stays private.

Open http://127.0.0.1:8000/ while the local server is running. Refresh the existing tab after changes. Alternatively, open `portfolio-preview.html`: it embeds all required assets and works offline.

Start the same port from this folder with `python -m http.server 8000 --bind 127.0.0.1`. No application dependencies or framework installation are required.

Latest repairs for the 14:57:42 recording: see `VIDEO_REPAIR_REPORT.md` and `VIDEO_REPAIR_PLAN.md`. Open `review-repair/index.html` for the source-matched before/after gallery and recordings. Older VIDEO_FIX reports describe earlier work.

## Try the interactions

- Earth selects the professional profile; the Moon selects personal interests. Details animate in.
- Project worlds change prominence when selected. Their labelled controls stay fixed. Select a world, a labelled control, or previous/next.
- Skill stars reveal descriptions. Make a wish launches a short meteor shower.
- Click the galaxy or Explode the galaxy. Its particles scatter and reform. Hovering alone does not trigger it.
- Click the black hole itself or Disturb spacetime for a gravity surge through the star field.
- Hover/focus the nebula to form new stars within the same stellar nursery. Leave to let them fade, or tap/click to pin and unpin their light.
- Follow the comet: checkpoint stars shine on arrival.
- Move the mouse for a star cursor with a fading trail. Touch, keyboard navigation, dialogs, small screens and reduced motion retain the native cursor.
- Open project briefs, the experience mission log, learning notes and milestone signals. These use native disclosures, work with a keyboard and remain usable without JavaScript.
- Hover or focus interactive elements for gentle feedback. Opening the mission log tilts Saturn; learning notes illuminate the nebula. New chapters enter once without hiding their content afterward.

## Personalize

In `index.html`, replace Your Name (including the page title), `assets/profile-placeholder.svg`, location, role, biography, interests, experience, education and milestones. Add verified contact, GitHub and résumé destinations where the unavailable status text appears. Replace concept summaries, expandable briefs and `.project-preview` mockups with real case studies and screenshots. Add verified project links when available. All personal content is intentionally sample material.

Skill descriptions are in `script.js`; colors, surface maps and responsive layouts are in `styles.css`. Attribution is in the footer and `ASSET_CREDITS.md`.

## Motion and fallbacks

The motion button pauses continuous scenes and settles an active explosion. System reduced motion takes priority. A shared clock renders only visible foreground scenes; offscreen CSS animation and hidden-tab rendering stop. Particle counts and pixel density are capped.

One shared native WebGL buffer provides spherical surface projection for the main worlds and animates the original reference-based black-hole artwork. It uses the existing scene clock; no Three.js or runtime dependency is required. Render sizes are capped at 1200px for the hero and 320px for planets, or 640px/160px on constrained devices. Original imagery and CSS spheres remain available when WebGL fails. The Moon follows the same tilted ellipse as its drawn orbit and resumes after pointer leave, even with retained keyboard focus. Its labelled selectors stay fixed. Saturn is an illustration with separate front/back ring layers. Galaxy positions/colors are sampled reproducibly from the original ORBIT galaxy artwork without a regular pixel grid. These are artistic effects, not physically accurate simulations. Without JavaScript, portfolio content remains readable.

## Build and verify

Run `node build-preview.cjs` after source edits to regenerate offline HTML, including font licenses. Run `node verify.cjs` with Playwright available to Node and Microsoft Edge installed. Tests default to port 8000; set `ORBIT_URL` to check another served URL.

The current test suite covers identity/actions, Moon movement with fixed selectors, rapid project selection, image hover/leave and touch pinning, three galaxy cycles, modal keyboard handling, expanded-section reflow, eight widths (320–1920px) in both themes, motion preferences, constrained-device settings, offline and no-JavaScript behavior. Set ORBIT_EVIDENCE to choose its output directory. Mobile planet selections bring new details into view.

The previous version's Lighthouse scores do not apply to this refinement. Current measurements use an Edge headless 4× CPU-throttled comparison, documented with limits in LIVE_TEST_REPORT.md. Safari/iOS, Firefox and physical-phone frame pacing have not been tested.

Current recording audit: VIDEO_FIX_PLAN.md and VIDEO_FIX_REPORT.md. Original foreground artwork, exact generation prompts and asset paths: ARTWORK_PROMPTS.md. Earlier notes: LIVE_POLISH_NOTES.md, LIVE_REFERENCES.md and LIVE_TEST_REPORT.md. PHASE_2_POLISH.md, MOTION_PLAN.md and IMPROVEMENTS.md are historical records. The immediate pre-fix site was backed up to `C:/Users/ashek/Downloads/orbit-video-audit-20261018/before-video-fixes.zip` with SHA-256 verification. GitHub main and the rejected prototype remain unchanged.
