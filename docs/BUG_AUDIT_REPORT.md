# Portfolio bug audit, 19 October 2026

The audit preserves the approved warm cosmic design, black-hole playback/scale/tilt, cursor, comet route, content and placeholder identity. Changes were prepared on the existing isolated feature branch; main and deployment stay unchanged.

## Skills and review scope

Applied design-taste-frontend (C:/Users/ashek/.codex/skills/design-taste-frontend/SKILL.md) for audit-first preservation, interaction states, accessible names, responsive layouts and performance; Ponytail for the smallest complete fixes. Design read: a creative technologist portfolio for visitors and recruiters; existing warm cinematic space language. Existing variance/motion/density remain approximately 8/7/3. User-approved custom cursor, zigzag route, dark hero and placeholders take precedence over generic aesthetic defaults. No dependencies were added to the application. Lighthouse ran from the already cached development tool.

## Reproduced and fixed

| Defect | Evidence before | Fix |
| --- | --- | --- |
| Section entry transitions finish instantly | Instrumented Element.animate reported duration 0 for intro-layout and station-copy. | Pass only the element to reveal, so forEach's index no longer replaces its 650ms duration. |
| Pointer leave cancels a keyboard-focused nebula | Focus remained on nebulaWindow, but its view reverted to nebula after moving the mouse away. | Preserve the reveal while focus remains on the control. |
| Focus leaving cancels an actively hovered nebula | The control still matched :hover but reverted to nebula when another element received focus. | Preserve the reveal while the pointer remains over the control. |
| Three accessible names disagree with visible labels | Lighthouse label-content-name-mismatch flagged the logo, Disturb spacetime and Click to scatter. | Let visible logo text provide its name, and include both buttons' visible labels in their accessible names. Visible copy stays unchanged. |

| Unnecessary GPU work on startup | Mobile trace recorded a 440ms simulated shader task before any planet was visible; total blocking time was 560ms. | Initialize the shared material renderer on its first visible-world draw; skip offscreen draws; paint one static projection on scene entry for paused/reduced-motion users. |

## Execution checks

The dedicated verify-audit.cjs reproduces the original failures and checks the repairs. It also tests WebGL context loss/fallback/restoration, map closing/focus restoration/anchor alignment, a scrollable 320 x 240 dialog, denied localStorage, unique IDs, valid fragment anchors, named buttons and one main heading. The existing regular and approved-effects suites cover portfolio selectors, rapid project selection, galaxy cycles, reduced motion, both themes, eight responsive widths, touch, no JavaScript, Canvas failure, cursor hover/trail/click, video playback/fallbacks and offline use.

Results and screenshots are in C:/Users/ashek/Downloads/orbit-bug-audit-20261019. BEFORE.json contains the observed defects. INTEGRATION_RESULT.json records the actual-file hashes and final post-copy tests; Lighthouse JSON records its own configuration and measurements. Final post-copy verification passed: 12 targeted audit groups and 16 regular portfolio groups, without captured application exceptions or unexpected resource failures.

## Remaining observations and limits

The initial desktop Lighthouse run scored 97 performance, 100 accessibility and 100 best practices, with LCP about 1.0s, CLS 0.007 and TBT 120ms. Its accessible-label mismatch was an additional unscored audit, so the 100 accessibility score did not establish absence of accessibility issues. Cache-lifetime suggestions concern the unchanged development server. Unused-CSS coverage from one viewport includes responsive/interactive states; no broad stylesheet rewrite was justified by this audit.

Physical phones, Safari/Firefox, assistive-technology sessions, real zoom, battery/thermal behavior and long-session memory remain untested. Lighthouse is a synthetic lab measurement, not a physical-device FPS guarantee. Original native video-loop hitches may still occur. Simulated mobile cold-load LCP remains around 5s and is recorded separately from measured startup blocking; this audit does not certify instant loads on slow networks. Personal/contact/project placeholders remain intentional.

## Rollback

Verified affected-file rollback: C:\Users\ashek\Downloads\orbit-bug-audit-20261019\BEFORE_ALL_AUDIT_FIXES_20261019-133516.zip

SHA-256: 97a2382f8e7f84717be81974d878ccfba6de8c4f1d72a0697c2c645c78d5d5fb

The archive includes original index.html, script.js, materials.js and portfolio-preview.html with a byte-verified manifest. The new regression test and this report can be removed when rolling back. The prior full project backup remains intact.

## Final performance evidence

| Mobile configuration | Performance | LCP | Blocking time | CLS |
| --- | --- | --- | --- | --- |
| Mobile before GPU deferral | 68 | 5.0s | 556ms | 0.000 |
| Mobile after GPU deferral | 80 | 5.3s | 0ms | 0.000 |
| Mobile DevTools throttling after GPU deferral | 91 | 2.8s | 9ms | 0.000 |

The simulated post-deferral audit scored 100 in the automated accessibility and best-practices categories, with visible-label matching passing. The separate DevTools-throttled run measured performance only. These are single-run lab comparisons, not statistically controlled physical-device benchmarks. Simulated and DevTools throttling are different configurations and must not be treated as interchangeable scores. Candidate port 8010 served the same final runtime bytes as the integrated app on port 8000. Lighthouse artifacts and the summarized configuration are retained externally.


Organization note: build tooling now lives in tools/, tests in tests/, current documentation in docs/, and unused local evidence in trash/. Earlier absolute paths describe historical evidence, not required project dependencies.
