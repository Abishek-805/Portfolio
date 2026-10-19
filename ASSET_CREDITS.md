# Asset credits and provenance

## Approved black-hole render, 19 October 2026

`black-hole-loop.webm`, `black-hole-loop.mp4` and `black-hole-poster.jpg`: locally rendered from [Realistic Black Hole by ArmTM](https://www.cgtrader.com/free-3d-models/space/other/realistic-black-hole-e501f1e4-383c-4f49-aa7a-c1386cc5c215), CGTrader Royalty Free (no AI). Rendered output incorporated into this portfolio; the source model remains private and was not submitted to an AI service. Camera locked; material-coordinate rotation forms a four-second loop, 768 x 432, 24 fps. No screen blending is used. The matching poster is the no-JavaScript, reduced-motion first-load and media-error fallback. Older artwork and research credits follow.

Comet head, tapered trails, dust, checkpoint rays and meteor streaks are drawn in SVG/Canvas, informed by the user-supplied reference; its JPEG is not used as a runtime overlay.

## Original foreground artwork, final recording revision

The earlier black-hole artwork, and the current spiral galaxy and learning nebula, are original AI-assisted assets generated with the built-in image_gen tool from the supplied references. See ARTWORK_PROMPTS.md for exact prompts, final project paths, dimensions, provenance and encoding details. They have genuine alpha, are fitted without cropping and are animated without changing their silhouettes. The generated galaxy is fictional; NGC 1300 is its credited visual reference, not its identity. Reference: NASA, ESA, and The Hubble Heritage Team (STScI/AURA), [NGC 1300](https://esahubble.org/images/opo0501a/), [CC BY 4.0](https://esahubble.org/copyright/). Older entries below describe historical assets and research.

## Recording corrections, 18 October 2026

`saturn-map.webp`: [Solar System Scope / INOVE Saturn map](https://www.solarsystemscope.com/textures/download/2k_saturn.jpg), [CC BY 4.0](https://www.solarsystemscope.com/textures/), resized from 2048×1024 to 1024×512 and encoded as WebP. It replaces the Cassini photograph in the experience scene with an explicitly illustrated sphere and code-drawn rings. Main planetary maps now use spherical shader projection. The earlier black-hole artwork was animated in place. The approved hero now uses the Blender-rendered loop described above.

Implementation reference: [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices), including bounded back buffers and graphics-context failure handling. One shared WebGL buffer serves visible scenes; the original Canvas/photo/CSS fallbacks remain.

## Current live refinement, 18 October 2026

See [LIVE_REFERENCES.md](LIVE_REFERENCES.md) for the full current asset list, adaptations, original source filenames, internet research and publication-rights status. Owner-supplied black-hole, Milky Way, nebula, planetary composition and meteor-landscape references are optimized locally as WebP. NGC 1300 is credited **NASA, ESA, and The Hubble Heritage Team (STScI/AURA)**, [ESA/Hubble source](https://esahubble.org/images/opo0501a/), [CC BY 4.0 terms](https://esahubble.org/copyright/). Its full credit is visible next to the actual scene; the image is also sampled into animated particles. Existing Solar System Scope maps, font notices and Saturn credit below remain applicable. No DNEG/movie frames are included as newly sourced media.

The remaining entries document earlier versions and research assets. They do not imply that the current hero is a NASA image, or that the old Whirlpool/Orion pictures are the current interactive galaxy/nebula.

## Version 4 animated surface maps

Earth, Moon, Jupiter and Mars maps by [Solar System Scope / INOVE](https://edu.solarsystemscope.com/textures/), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The 2K JPEGs were resized to 1024 pixels wide and encoded as WebP. CSS shading, surface movement and orbital placement are artistic presentation effects.

- `earth_daymap-map.webp`: https://edu.solarsystemscope.com/textures/download/2k_earth_daymap.jpg
- `moon-map.webp`: https://edu.solarsystemscope.com/textures/download/2k_moon.jpg
- `jupiter-map.webp`: https://edu.solarsystemscope.com/textures/download/2k_jupiter.jpg
- `mars-map.webp`: https://edu.solarsystemscope.com/textures/download/2k_mars.jpg

The profile SVG is a code-drawn placeholder silhouette. The galaxy, meteors, black-hole flow particles and cursor trail are procedural. The Whirlpool photograph remains the no-JavaScript galaxy fallback. The earlier Earth/Jupiter photographs listed below are previous-version/research assets, replaced by surface maps in the current layout.

## Photographs and earlier references

Images were researched on the web and stored locally for reliable offline use. WebP copies are delivery encodings of the source images. CSS masks, placement, saturation, and motion are presentation effects.

| Local asset | Source / credit |
| --- | --- |
| `gargantua-reference.webp` | User-supplied `codex-clipboard-932c47c1-bdf7-46e5-853f-28da0c95f495.jpg`. Used at the user's request as an Interstellar-inspired visual reference. Original creator/license was not supplied; this is not described as a NASA image or a verified film frame. |
| `earth.webp` | [Blue Marble 2002](https://science.nasa.gov/resource/blue-marble-2002/). NASA / Robert Simmon and Reto Stöckli. |
| `jupiter.webp` | [Jupiter 2019](https://science.nasa.gov/asset/hubble/jupiter-2019/). NASA, ESA, A. Simon (GSFC), M.H. Wong (UC Berkeley). |
| `saturn.webp` | [Fantastic Planet](https://science.nasa.gov/photojournal/fantastic-planet/). NASA/JPL/Space Science Institute. |
| `galaxy.webp` | [Whirlpool Galaxy M51 and companion](https://science.nasa.gov/asset/hubble/out-of-this-whirl-the-whirlpool-galaxy-m51-and-companion-galaxy/). NASA, ESA, S. Beckwith (STScI), the Hubble Heritage Team (STScI/AURA). |
| `nebula.webp` | [The Orion Nebula's Biggest Stars](https://science.nasa.gov/asset/hubble/the-orion-nebulas-biggest-stars/). NASA, ESA, M. Robberto (STScI/ESA), the Hubble Space Telescope Orion Treasury Project Team. |

The user's small spiral galaxy reference informed the direction. The interactive observatory uses a procedural galaxy; a higher-resolution NASA/ESA Whirlpool image supplies its no-JavaScript fallback.

## Black hole research

- [DNEG: new black hole imagery](https://www.dneg.com/news/new-black-hole-imagery)
- [DNEG: gravitational lensing by spinning black holes](https://www.dneg.com/news/gravitational-lensing-by-spinning-black-holes)
- [Gravitational Lensing by Spinning Black Holes in Astrophysics, and in the Movie Interstellar](https://arxiv.org/abs/1502.03808)
- [NASA black hole visualization](https://svs.gsfc.nasa.gov/13326)

The hero uses the supplied reference, not a new physics simulation. NASA/ESA do not endorse this portfolio. Confirm the supplied hero image's publication rights before a public commercial launch.

## Fonts

Space Grotesk Regular and Barlow Condensed Medium were obtained through Google Fonts. Local fonts have been subset to Latin text and common punctuation to reduce transfer size. Their SIL Open Font License notices are in `assets/space-grotesk-OFL.txt` and `assets/barlow-condensed-OFL.txt`, and are embedded as comments in the standalone HTML.
