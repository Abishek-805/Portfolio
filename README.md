# ORBIT — animated cosmic portfolio, phase 2 polish

Open http://127.0.0.1:8000/ while the local server is running. Refresh the existing tab after changes. Alternatively, open `portfolio-preview.html`: it embeds all required assets and works offline.

Start the same port from this folder with `python -m http.server 8000 --bind 127.0.0.1`. No application dependencies or framework installation are required.

## Try the interactions

- Earth selects the professional profile; the Moon selects personal interests. Details animate in.
- Project satellites orbit while idle and hold position while hovered or keyboard-focused. Select a planet or use previous/next.
- Skill stars reveal descriptions. Make a wish launches a short meteor shower.
- Click the galaxy or Explode the galaxy. Its particles scatter and reform. Hovering alone does not trigger it.
- Click the black hole crosshair for a gravity surge through the star field.
- Follow the comet: checkpoint stars shine on arrival.
- Move the mouse for a star cursor with a fading trail. Touch, keyboard navigation, dialogs, small screens and reduced motion retain the native cursor.
- Open project briefs, the experience mission log, learning notes and milestone signals. These use native disclosures, work with a keyboard and remain usable without JavaScript.
- Hover or focus interactive elements for gentle feedback. Opening the mission log tilts Saturn; learning notes illuminate the nebula. New chapters enter once without hiding their content afterward.

## Personalize

In `index.html`, replace Your Name (including the page title), `assets/profile-placeholder.svg`, location, role, biography, interests, experience, education, milestones and `hello@example.com`. Replace concept summaries, expandable briefs and `.project-preview` mockups with real case studies and screenshots. Add verified project links when available. All personal content is intentionally sample material.

Skill descriptions are in `script.js`; colors, surface maps and responsive layouts are in `styles.css`. Attribution is in the footer and `ASSET_CREDITS.md`.

## Motion and fallbacks

The motion button pauses continuous scenes and settles an active explosion. System reduced motion takes priority. A shared clock renders only visible foreground scenes; offscreen CSS animation and hidden-tab rendering stop. Particle counts and pixel density are capped.

Planets are shaded CSS spheres with moving surface maps. The hero combines the supplied Interstellar-inspired image with flowing particles and a gravity surge. The galaxy is procedural. These are artistic effects, not physically accurate simulations. Without JavaScript, profile and project content remains readable and the galaxy photograph remains visible.

## Build and verify

Run `node build-preview.cjs` after source edits to regenerate offline HTML, including font licenses. Run `node verify.cjs` with Playwright available to Node and Microsoft Edge installed. Tests default to port 8000; set `ORBIT_URL` to check another served URL.

Checks passed for identity, Earth/Moon, moving/held/resumed orbits, projects, native disclosures, skills, black-hole surge, galaxy explosion/reassembly, cursor, checkpoints after expanded-content reflow, six viewport widths (320–1920px), keyboard/touch, themes, pause/reduced motion, offline and no-JavaScript content. Mobile planet selections bring the new details into view. Light mode preserves the full Jupiter sphere and repaints the galaxy even while motion is paused.

Final local mobile Lighthouse: **95 performance, 100 accessibility, 100 best practices, 100 SEO**. These are simulated lab scores; `lighthouse-mobile.json` contains settings and metrics. Safari/iOS and physical-phone frame pacing have not been tested.

See `PHASE_2_POLISH.md`, `MOTION_PLAN.md` and `IMPROVEMENTS.md`. Before phase 2 began, the complete previous version was saved to `orbit-before-phase-2-20261018-002513.zip`. Earlier version archives also remain in the working folder.
