# ORBIT — repairs for recording 2026-10-18 14:57:42

The actual local portfolio has been repaired in an isolated development worktree. The previous version is preserved in PRE_VIDEO_FIX_BACKUP.zip. GitHub main and deployment were not modified. This report supersedes the older VIDEO_FIX_REPORT.md.

## Provenance and scope

The supplied recording independently decodes as 2292 frames, 76.40 seconds, 1918×1078 at 30 fps. Its SHA-256 matches the provided manifest: `a0fafae70eb15f4ac57aa2f73acbc52217b78fc87992112a6ed71ab2a0b5a11e`. The full video was decoded and sampled every two seconds, with the supplied critical closeups inspected. The local source has the matching artwork and scene layout; a video cannot establish a source-file hash. Before editing, its core files matched the development copy byte for byte, and the original 25 existing check groups passed.

Changes reach index.html, styles.css, script.js, materials.js, the existing verification suite, README, and the regenerated standalone export. No framework, runtime dependency, Three.js, deployment or new personal claims were added. All source artwork/assets retain their original bytes and alpha. Browser Canvas/WebGL supplies the animation; fallback HTML stays usable.

## Defects and results

| Issue | Repair and verified result |
| --- | --- |
| BH-01 | Differential angular material advection, moving turbulence and emissive knots replace brightness-only motion. Polar-unwrapped GPU captures track features moving about 45° over one second; the alpha silhouette is identical across frames. The shadow stays black. This is an artistic projection, not a relativistic simulation. |
| BH-02 | Tone mapping bounds radiance, click exposure adds at most 12%, and the surge settles after one second from the latest click. Three repeated activations and a 60-second no-input capture pass. |
| JOURNEY-01 | A measured S-route visits alternating desktop checkpoints, crossing the clear inter-chapter bands. The narrow layout retains a gentle reading-safe gutter. All eight stops synchronize with the traveler. |
| JOURNEY-02 | One normalized route signal drives head/tail, active/past states and arrival ring. Forward/reverse, all 16 desktop/phone intersections, stationary resize, disclosures, anchors and the final Contact segment pass. |
| ORBIT-01 / 02 | Moon revolution is about 26 seconds; tilted path geometry and front/back depth share the same projection. A 13-second capture shows both depth states. Only hovering the moving Moon holds it; fixed selectors, retained focus, pointer leave, keyboard and touch work. |
| SKILL-01 | Larger desktop constellation; quiet base edges and a clear selected connection. Readout reveals remain brief, and layout stays fixed. All five controls, focus, hover and narrow layouts pass. |
| METEOR-01 | Stronger luminous heads, direction-matched gradient tails and a short bounded shower. Ten rapid activations replace the pending shower instead of accumulating effects; pause/reduced motion clear it. |
| PROJECT-01 / 02 | Smaller featured bodies give details room. Matching world colors link selected artwork, caption and panel edge. The existing shared sphere shader and front/back rings are retained. Ten rapid selections end with matching world, panel and count. |
| EXPERIENCE-01 | Opening the native mission disclosure lights the corresponding lower ring sector and reveals its notes. Keyboard focus and native document flow remain intact; no invented extra roles. |
| EDUCATION-01 | Removed the alternate galaxy entirely. Six stars form inside the unchanged nebula on hover/focus/tap, fade on leave, and can be pinned. Transition captures retain transparent corners. The no-Canvas fallback keeps the nebula and a star signal. |
| OBS-01 | Galaxy artwork opacity never falls below 28%; core particles move much less, with brighter bounded scatter and smooth return. Measured computed opacity, three cycles, pause, rapid activation and original-image return pass. Clicking during reassembly reverses the burst at the same positions. |
| OBS-02 | Retained seeded, independently sampled image-colored particles. Their excursions are bounded to the visual area; the empty ellipse trace is removed. Captured scatter/reassembly has no regular sampling grid. |
| CURSOR-01 | Six-point short-lived tail, no pointer interception, native cursor on text inputs, touch, dialogs, keyboard use, small screens, low tier and reduced motion. Automated pointer checks pass; physical pointer latency remains unmeasured. |
| CONTACT-01 | Softer landscape blend into the shared sky. Anchor, 320px hit-target, floating-control and expanded-content checks pass. A heading temporarily passing behind a fixed header during ordinary wheel scrolling is expected. |

## Verification

Execution used locally installed Edge/Chromium and Playwright. Results and raw clips are in the separate QA evidence bundle; selected evidence is also in review-repair/index.html.

- Existing portfolio suite: 16 groups pass, including eight widths (320–1920), both themes, expanded disclosures, keyboard modal behavior, touch emulation, honest placeholders, zero JavaScript errors and zero failed network requests.
- Recording regression suite: 9 groups pass, including context loss/recovery, unavailable WebGL, exact paused-frame equality, transparency and final route geometry.
- Issue-specific suite: 7 groups pass, including computed galaxy opacity (not only a CSS custom property), rapid controls, input cursor and mission highlight.
- Independent route suite: all eight desktop and all eight phone checkpoint intersections pass, including forward/reverse capture.
- Material transport analysis: four one-second GPU frame pairs have a nonzero best angular feature shift; source alpha is invariant. A separate 60-second no-input browser capture and repeated surges pass.
- Thirteen-second Moon/front-back sequence and multi-frame nebula/galaxy capture pass. Offline single-file operation makes zero HTTP requests; no JavaScript and no Canvas keep the portfolio readable and controls usable where applicable.

Two test corrections matter: a prior pixel-difference test alone did not prove gas transport, so feature correlation was added. A low-specificity galaxy CSS rule was also overridden by legacy opacity rules; the new test reads computed image opacity and caught this. One overlapping browser run failed GPU initialization; isolated reruns and deliberate context-loss recovery pass. Tests are run sequentially for GPU/performance evidence.

## Performance and remaining risks

One shared WebGL buffer, cached textures, offscreen scene suspension and elapsed-time animation remain. The stronger material shader has a real cost. Constrained-device resolution is capped at 270px for the black hole and 128px for worlds (standard: 1000px/320px); low-tier rendering targets 20fps and standard rendering 30fps. Reduced motion and persistent Pause remain available. Lower tiers trade detail for cost.

The local 390×844 / reported 2GB and 2 cores / 4× CPU-throttle comparison is a synthetic sample, not a phone benchmark or FPS guarantee. The last frame sample had zero frames over 50ms after repairs. rAF callback intervals are not material-render FPS; the low tier produced roughly 18 material frames per second in the sample. Hero main-thread task time remained higher than baseline (about 1.09s vs 0.42s over 2.23s under 4× throttle); the improved material is not free. No claim of universal performance improvement is made. Loading and interaction timings vary with the host; raw measurements are retained.

Physical Android/iOS, Safari, Firefox, touch thermals, real GPU power, high-refresh pointer latency and screen-reader usability were not tested. A final physical-device pass remains recommended. There is no known failing automated check at delivery. Portfolio identity, project claims, dates, résumé and contact addresses remain intentionally editable placeholders.

## Run and review

The normal application is index.html. Serve the folder with `python -m http.server 8000 --bind 127.0.0.1`, or open portfolio-preview.html offline. Open review-repair/index.html for before/after images and controlled recordings. Runtime needs no package install; development tests need Playwright and Edge.

Backup, source patch, source fingerprints, source ZIP and QA evidence ZIP are alongside this report in the dated delivery folder. Original media/reference assets are preserved. Recommended next step: assess the actual local page, replace placeholders, then test one low-end Android and one iPhone before considering any deployment.

## References consulted

- [NASA: visualization of a black hole’s warped world](https://www.nasa.gov/universe/nasa-visualization-shows-a-black-holes-warped-world/) — material flow and lensed accretion reference.
- [MDN: WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) — bounded resources and recovery guidance.
- Supplied ORBIT_VIDEO_REPAIR_AUDIT_BUNDLE, timestamped reference frames, exact-recording prompt and the original owner-provided imagery. Existing image/font licensing and original artwork prompts are preserved in ASSET_CREDITS.md and ARTWORK_PROMPTS.md.
