# ORBIT V4.2 G1 publication scope

Published to a feature branch at the user's request on 19 October 2026. The protected main branch is not changed by this publication.

The runtime matches the G1 candidate previously approved and integrated locally. Relative to its preserved pre-G1 baseline, the reviewed application changes are in `script.js`, `styles.css`, regenerated `portfolio-preview.html` and the existing `verify.cjs`. Earlier local improvements that formed that baseline are included so the branch is runnable.

G1 preserves the route geometry and checkpoint order. It adds a bounded cursor trail and viewport-only scrollbar hiding, and caches progress/geometry calculations so scrolling still updates the journey when ambient motion is paused. Portfolio content, artwork, Earth/Moon, project controls, themes, keyboard navigation and fallbacks remain available.

Before local integration, an incomplete earlier rollback ZIP was found to omit the stylesheet. A corrected complete 102-file archive was created, extracted and SHA-verified before any integration. That private local archive and machine-specific audit paths are intentionally excluded from this repository.

The local integration passed all 16 regular regression groups plus focused cursor/journey checks. HTTP source bytes and route geometry matched the reviewed candidate at five widths. Before publication, the G1 runtime was compared again against the approved source. Git checkout normalized line endings in the material renderer and offline export; their normalized content matches, and the other four files match byte for byte.

No G2 video study, Tripo candidate, supplied CGTrader Blender model, private account configuration, backup ZIP, generated audit recording or deployment configuration is added by this publication. G2+ integration and merge/deployment decisions remain separate.

Known limits: personal content is still sample material. Physical mobile devices, Safari/Firefox, screen-reader behavior, thermal and battery performance have not been validated. The black-hole motion and other later visual improvements remain under review.
