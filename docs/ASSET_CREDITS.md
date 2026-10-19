# Asset credits and provenance

Only media required by the current portfolio remains in `assets/`. Earlier images, unused originals and research copies are preserved locally under `trash/assets/` and excluded from the current Git tree. Historical source notes are in [REFERENCE_SOURCES.md](REFERENCE_SOURCES.md).

## Black-hole render

`black-hole-loop.webm`, `black-hole-loop.mp4` and `black-hole-poster.jpg` were rendered locally from [Realistic Black Hole by ArmTM](https://www.cgtrader.com/free-3d-models/space/other/realistic-black-hole-e501f1e4-383c-4f49-aa7a-c1386cc5c215), CGTrader Royalty Free (no AI). The incorporated rendered output is supplied; the private Blender model is not redistributed and was not submitted to an AI service.

The camera was locked and material-coordinate rotation looped in Blender. The source loop is four seconds at 24 fps, 768 x 432; the website plays it at 0.6x. A matching poster provides static/error/no-JavaScript fallback. Normal opaque compositing preserves the black event horizon.

## Galaxy and nebula

`spiral-galaxy-original.webp` and `nebula-original.webp` are original AI-assisted artwork created for ORBIT with the built-in image_gen tool. Exact prompts and encoding notes are retained in [ARTWORK_PROMPTS.md](ARTWORK_PROMPTS.md). Both preserve their transparent outer silhouettes. The same artwork supplies interactive and no-JavaScript presentation.

The galaxy is a fictional illustration informed by [NGC 1300](https://esahubble.org/images/opo0501a/), credited to NASA, ESA, and The Hubble Heritage Team (STScI/AURA), under [ESA/Hubble CC BY 4.0](https://esahubble.org/copyright/). It is not presented as a scientific photograph. Its colors and positions are sampled into the code-drawn particles.

## Planet maps

Earth, Moon, Jupiter, Mars and Saturn maps are by [Solar System Scope / INOVE](https://edu.solarsystemscope.com/textures/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Source maps were resized and encoded as WebP; shading, surface motion and orbits are artistic adaptations.

| Current asset | Source map |
| --- | --- |
| `earth_daymap-map.webp` | [Earth day map](https://edu.solarsystemscope.com/textures/download/2k_earth_daymap.jpg) |
| `moon-map.webp` | [Moon](https://edu.solarsystemscope.com/textures/download/2k_moon.jpg) |
| `jupiter-map.webp` | [Jupiter](https://edu.solarsystemscope.com/textures/download/2k_jupiter.jpg) |
| `mars-map.webp` | [Mars](https://edu.solarsystemscope.com/textures/download/2k_mars.jpg) |
| `saturn-map.webp` | [Saturn](https://www.solarsystemscope.com/textures/download/2k_saturn.jpg) |

## Scenery and code artwork

`milky-way.webp`, `distant-worlds.webp` and `meteor-landscape.webp` are optimized encodings of the owner-supplied reference images. Original filenames and source/rights notes are preserved in [REFERENCE_SOURCES.md](REFERENCE_SOURCES.md).

`profile-placeholder.svg` is an explicitly replaceable silhouette drawn in code. The comet, cursor, trails, meteors, constellation, orbit lines and Saturn rings use native SVG/Canvas/CSS. The reference comet JPEG is not used as a runtime overlay. No Three.js or GSAP library is shipped by the current app.

## Fonts

Space Grotesk Regular and Barlow Condensed Medium were obtained through Google Fonts and subset to Latin text/common punctuation. Their SIL Open Font License notices are retained in `assets/space-grotesk-OFL.txt` and `assets/barlow-condensed-OFL.txt` and embedded in the offline edition.

NASA/ESA and other credited creators do not endorse this portfolio. Older research citations in the footer and source notes do not identify the current black hole as NASA imagery or the current nebula/galaxy as an old photograph.
