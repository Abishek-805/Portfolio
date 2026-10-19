# ORBIT — cosmic portfolio, approved G1

A responsive personal portfolio presented as a cosmic journey: identity, profile, skills, projects, experience, education, milestones and contact. Personal details and project case studies are intentionally placeholders.

This branch contains the approved V4.2 G1 version. It preserves the artwork, sections, Earth/Moon interaction, project worlds and zigzag journey. G1 adds a tapered cursor trail, hides only the viewport scrollbar and caches journey geometry while preserving native scrolling, reverse travel and paused-mode progress.

G2 black-hole comparisons, Tripo experiments and the separately supplied Blender model are not integrated. Publishing this branch does not deploy the site or merge it into main.

## Run locally

From the repository folder:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. Choose another port if 8000 is already in use. No build or application dependency installation is required. `portfolio-preview.html` is a self-contained offline export.

## Interactions

- Earth and Moon reveal professional and personal profile details.
- Project planets and their fixed controls select project stories and expandable briefs.
- Constellation stars reveal skills; the wish interaction triggers a bounded meteor shower.
- Clicking the galaxy scatters and regroups its particles. The nebula forms stars on hover or focus and supports tap-to-pin.
- The comet follows the journey, with checkpoint feedback. The black-hole interaction triggers the existing gravity surge.
- The star map supports keyboard navigation and Escape. Native disclosures reveal additional portfolio details.

Use the motion and theme controls in the header. System reduced motion takes priority. Touch, keyboard navigation, dialogs and constrained devices retain the native cursor. Portfolio content stays readable without JavaScript; original images and CSS worlds provide rendering fallbacks. Effects are artistic illustrations, not physically accurate simulations.

## Personalize and maintain

Edit the identity, profile, project summaries, experience, education, milestones and contact placeholders in `index.html`. Replace `assets/profile-placeholder.svg` with your portrait. Add verified project, email, GitHub and resume destinations. Skills are in `script.js`; visual styling is in `styles.css`. The bounded native WebGL material renderer is in `materials.js`; no Three.js dependency is used.

After editing source or assets, regenerate the offline export:

```powershell
node build-preview.cjs
```

With Playwright available to Node and Microsoft Edge installed, run the regression suite against the local server:

```powershell
$env:ORBIT_URL = 'http://127.0.0.1:8000/'
node verify.cjs
```

`ORBIT_EVIDENCE` can select a test-output folder. Tests cover content and interactions, keyboard dialogs, responsive themes, motion preferences and fallbacks. Local Chromium checks do not establish physical-phone, Safari, Firefox, screen-reader, thermal or battery performance.

Asset attributions are retained in `ASSET_CREDITS.md`, license notices and the page footer. Earlier repair notes remain historical records; `G1_RELEASE_NOTES.md` describes this branch's publication scope.
