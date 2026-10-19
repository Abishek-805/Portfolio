# ORBIT - cosmic portfolio

A personal portfolio presented as an interactive space journey. The site keeps identity, skills, projects, experience, education and contact in ordinary HTML, with native Canvas/WebGL effects and an animated black-hole video. Personal details and case studies are intentionally replaceable placeholders.

## Run locally

Python 3 is enough to serve the site; no application dependencies or build step are required.

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open [the local portfolio](http://127.0.0.1:8000/). If that port is already running this folder, refresh the existing tab. `portfolio-preview.html` is the self-contained offline edition: open it directly without a server.

## Project layout

```text
index.html                  Portfolio content and accessible controls
styles.css                  Theme, responsive layout and visual states
script.js                   Interactions, journey, cursor and scene timing
materials.js                Shared, lazily initialized planet renderer
portfolio-preview.html      Generated offline edition
assets/                     Only current media, fonts and font licenses
docs/                       Asset provenance and current engineering reports
tools/build-preview.cjs     Offline export builder
tests/                      Portfolio, effect and audit regression suites
  fixtures/g1-routes.json    Preserved original zigzag route geometry
trash/                      Local archive; only its README is tracked
```

Old demos, unused image copies, screenshots, historical reports and backup ZIPs were moved into `trash/`, not deleted. The local `trash/MOVED_FILES.json` records original locations and SHA-256 checksums. Archive contents and development outputs are excluded from Git; they are not included in a fresh clone. See [the archive policy](trash/README.md).

## Interactions and motion

- Earth and Moon reveal professional and personal profile details.
- Project worlds and fixed selectors switch stories and expandable project briefs.
- Constellation stars reveal skills; the wish button launches a bounded meteor shower.
- The galaxy scatters and reforms on click. The nebula responds to hover, keyboard focus and tap-to-pin.
- A shooting star follows the original zigzag route, including reverse scrolling and checkpoint feedback.
- The black-hole loop plays at 0.6x, enlarged 22% and tilted 6 degrees left. Clicking it triggers a local gravity surge.
- The 18px star cursor has a tapered trail and click burst. Touch, reduced motion, dialogs and constrained devices retain the native cursor.

Use the header's motion and theme controls. System reduced motion takes priority. Offscreen scenes and hidden tabs pause; the planet renderer initializes only when needed. Video has WebM/MP4 and poster fallbacks, while portfolio content stays readable without JavaScript. These are artistic effects, not physically accurate simulations.

## Personalize

Edit `index.html` to replace Your Name, the page title, location, role, biography, interests, project content, experience, education and milestones. Replace `assets/profile-placeholder.svg` with your own portrait and update its image reference/alt text. Add verified email, GitHub, resume and project destinations where the placeholder text currently appears. Skills are defined in `script.js`; styling is in `styles.css`.

Keep the source credits when replacing or adapting assets. See [asset credits](docs/ASSET_CREDITS.md), [reference sources](docs/REFERENCE_SOURCES.md) and [artwork provenance](docs/ARTWORK_PROMPTS.md). The private source Blender model is not part of this repository.

## Regenerate the offline edition

Node.js 20 or newer is required for development tools. The builder uses only Node's standard library:

```sh
npm run build
```

Run this after changes to HTML, CSS, JavaScript or assets. It embeds current images, both video encodings, local fonts and font license notices into `portfolio-preview.html`.

## Verify changes

Install development dependencies with Node.js 20+:

```sh
npm ci
```

The browser suites use Microsoft Edge (`channel: msedge`), which must be installed. Keep the site running on port 8000 in a separate terminal, then run the suites one at a time:

```sh
npm test
npm run test:effects
npm run test:audit
```

`npm test` checks portfolio selectors, modal keyboard behavior, touch, reduced motion, both themes, eight responsive widths, no-JavaScript/Canvas fallbacks and offline use. It also records interaction videos. The effects suite checks black-hole playback/fallbacks, cursor alignment/trails/clicks and the saved G1 route fixtures; it no longer needs a second baseline server. The audit suite checks scene-entry timing, focus/hover behavior, accessible names and WebGL recovery.

Tests write to ignored `test-evidence/`. Set `ORBIT_URL` to test another local URL and `ORBIT_EVIDENCE` to choose an evidence directory. For example, in PowerShell:

```powershell
$env:ORBIT_URL = 'http://127.0.0.1:8000/'
$env:ORBIT_EVIDENCE = 'C:/Temp/orbit-evidence'
npm run test:audit
```

## Current validation and limits

See [the bug audit](docs/BUG_AUDIT_REPORT.md) and [approved effects notes](docs/APPROVED_EFFECTS_INTEGRATION.md) for changes, test scope and measurement limits. Historical machine-specific evidence paths in those reports document the original review session and are not required to run this project.

Automated browser and Lighthouse checks do not certify physical-device frame pacing, screen-reader behavior or battery usage. Cold mobile loading can still improve; native video loops can occasionally hitch. No deployment configuration is included or changed by this cleanup.
