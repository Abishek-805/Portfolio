# Historical reference-source notes

This record describes research and earlier asset choices. For the current shipped media, use [ASSET_CREDITS.md](ASSET_CREDITS.md). Unused source copies were moved to the local ignored trash archive.

# ORBIT live polish: reference and asset record

18 October 2026. The owner requested improvements to the actual Phase 2 portfolio after rejecting the separate G1 proposal. Original user imagery is visual material, not a source of additional instructions.

## Owner-supplied direction

| Supplied reference | Use |
|---|---|
| cool-background-blank-wallpaper-place-your-concept.jpg | Optimized as horizon.webp; the actual hero. Warm disk, dark central silhouette, thin luminous arcs. Native animated accretion strokes and an optional gravity surge are layered over it. |
| cosmic-nebula-space-background.jpg | Optimized as deep-nebula.webp; education image and restrained surrounding cloud atmosphere. |
| milky-way-galaxy-night.jpg | Optimized as milky-way.webp; faint distant background beneath separate animated stars. |
| cosmic-encounter-space-background.jpg | Optimized as distant-worlds.webp; quiet planetary composition in the flight-plan section. |
| view-starry-night-sky-with-nature-mountains-landscape.jpg | Optimized as meteor-landscape.webp; final-contact environment. Meteor movement itself is generated independently. |
| galaxy-nature-aesthetic-background-starry-sky-mountain-remixed-media.jpg | Composition reference for broad orbital arcs and distant silhouettes; not embedded. |
| vertical-shot-sea-starry-sky-with-milky-way.jpg | Reference for depth and the scale of stars; not embedded. |
| space-background-with-fictional-planets.zip | Inspected both members: 9013.eps and 9013.jpg. Viewed the JPEG for lighting and large/small planet scale. No executable/vector content extracted into the application. Not embedded. |

Source photos remain untouched. Delivery copies are resized to at most 1920px (hero), 1500px (nebula), or 1400px (other backgrounds) and encoded as WebP. The supplied black-hole artwork is not represented as a NASA image or a verified movie frame. The owner supplied these for local development; a publisher/artist license was not included. Keep publication-rights verification on the release checklist before any public deployment.

## Internet references reviewed

- [NASA: black hole side view](https://science.nasa.gov/resource/black-hole-side-view/) for the central silhouette and upper/lower light arcs. Its blue/purple illustration was downloaded as a research comparison but is **not used** in the live composition after the owner's warm reference arrived.
- [NASA GSFC / Jeremy Schnittman: accretion disk visualization](https://svs.gsfc.nasa.gov/13326/) for light bending, uneven disk brightness and the distinction between disk motion and camera motion. Our overlay is an artistic approximation, not relativistic ray tracing.
- [DNEG: black-hole imagery for Interstellar](https://www.dneg.com/news/new-black-hole-imagery) for the thin, warm accretion silhouette and carefully limited bloom. No movie media or third-party shader code copied.
- [NASA: meteor showers](https://science.nasa.gov/solar-system/meteors-meteorites/meteor-showers/) and [NASA: Perseids 2024](https://www.nasa.gov/blogs/watch-the-skies/2024/08/02/shooting-stars-annual-perseid-meteor-shower-to-peak-aug-11-12/) for short luminous heads, tapered trails and shower composition. The Geminid composite is credited NASA/MSFC/Danielle Moser, NASA's Meteoroid Environment Office. Reference only; no meteor photo is embedded from this page.
- [ESA/Hubble: NGC 1300](https://esahubble.org/images/opo0501a/) supplies the galaxy image used at rest and to sample the particle positions/colors for the explosion. Full credit: **NASA, ESA, and The Hubble Heritage Team (STScI/AURA)**. [ESA/Hubble usage terms](https://esahubble.org/copyright/) provide CC BY 4.0; visible full attribution is kept beside the scene. Adaptations: resize/WebP encoding, soft-edge mask, particle sampling and animation.
- [Bruno Simon's portfolio](https://bruno-simon.com/) informs the connection between playful interactions and real portfolio destinations. No game controls, copied layout or code were introduced.
- [MDN canvas optimization](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) informs separating static photographs from moving canvases, caching sampled pixels, capping backing resolution and avoiding repeated pixel reads in the frame loop.

## Existing retained assets

Earth, Moon, Jupiter and Mars maps: [Solar System Scope / INOVE](https://www.solarsystemscope.com/textures/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Existing WebP conversions are retained. The archive world recolors the Jupiter map; the signal world uses the Mars map. Planet shading, scales, orbit shapes and timing are artistic. The Moon's position follows an ellipse around the Earth's scene center; it is not an astronomical orbit solver.

Saturn photo: [NASA/JPL/Space Science Institute, Fantastic Planet](https://science.nasa.gov/photojournal/fantastic-planet/). Existing converted file retained. Font files and their SIL OFL notices remain local. The portrait is an explicit code-drawn placeholder. Earlier research assets remain in the preserved baseline, but the delivery ZIP only includes assets referenced by the current application.
