# Approved effects integration — 19 October 2026

The user approved black-hole candidate C, the shooting-star journey and trails, and requested a larger cursor. These effects are now the local portfolio implementation. The warm theme, sections, placeholders, original cubic zigzag geometry and checkpoint order remain intact.

- Black hole: approved four-second Blender-rendered loop, 768 x 432 / 24 fps; WebM 367,757 bytes with MP4 fallback and a matching poster. Native opaque compositing preserves the event horizon. Removed the previous per-frame hero shader/Canvas work; planetary materials are retained. Video source elements are created lazily, avoiding stale empty-source errors when parsing the standalone export. Native video pauses with the motion setting, system reduced motion, tab visibility and offscreen status. First-load reduced motion and saved pause fetch no video; autoplay refusal offers a retry button; media failure preserves the poster.
- Journey: blue-white/gold tapered wake, tangent-oriented glow, subtle dust and warm checkpoint rays. Reverse scrolling and paused progress work with the exact G1 path. Cursor: 18px, increased from the approved study's 10px; correct centering, short fading trail, native fallbacks. The reviewed bounded showers use 16 desktop / 7 mobile meteors.
- Offline export includes both video encodings. Asset credits distinguish the incorporated rendered output from older AI-assisted art. The source Blender file, render tools and study demos are not copied into the app.

## Verification

Candidate: 16 regular regression groups passed; 13 focused integration groups passed; 16 journey/effects groups passed. Edge Chromium, 320/390/768/1440/1920 screenshots in both themes; regular responsive checks additionally cover 360/600/1024. Exact G1 route equality at five widths. 64 forward/reverse poses: maximum route error 0.368px; tangent dot product > .96. Decoded changing video frames and an actual wrap were observed. MP4 fallback, all-video failure, autoplay denial/retry, reduced motion, saved pause, no JavaScript, Canvas failure, offscreen pause, standalone offline playback, and cursor trail decay checked. No captured JS exceptions or unexpected failed requests in the regular suite.

Local port 8000 is checked again after the guarded copy; final results and per-file hashes are in `C:/Users/ashek/Downloads/orbit-integration-20261019/INTEGRATION_RESULT.json`. Evidence is in that same folder. Tests ran without recording video; prior approved comparison recordings remain in the review bundle. `tests/verify.cjs` retains its regular recording behavior; `tests/verify-approved-effects.cjs` checks this integration and requires the preserved G1 server on port 8009 for exact route comparisons.

## Rollback and scope

Fresh rollback: `C:\Users\ashek\Downloads\orbit-integration-20261019\ORBIT_BEFORE_APPROVED_EFFECTS_20261019-102924.zip`.
Archive SHA-256: `cab195f2a9ba822271e076e66c26c0933ce86b3c4e6d804801afe20e352a1115`. All 153 archived files were checked against the embedded manifest; node_modules and existing ZIP archives were excluded and remain untouched. Restore only the changed files from this archive and remove the three new video/poster assets plus new test/report files if rolling back. The external integration result enumerates them and their hashes.

Work is isolated on feature/orbit-approved-effects-20261019, then copied into the original non-Git local app. GitHub main, remote pushes and deployment remain untouched. Backup and integration compare original bytes before copying and refuse to overwrite concurrent edits.

## Limits

Physical phones, Safari/Firefox, thermal/battery behavior and screen readers were not tested. Browser measurements are not physical-device FPS. Native video can still show a short playback hitch at a loop boundary, as disclosed in candidate C's review. The portfolio still uses the requested replaceable personal/project placeholders.

## Requested cursor and hero refinement

Playback runs at 0.6x. The video and matching poster share a 22% enlargement and 6-degree counterclockwise tilt. Cursor hover scales only its pseudo-element artwork, fixing the displaced hit-point appearance. The trail is bounded to 160px (120px over controls), with 360ms decay and 48 samples. Click feedback is a 480ms luminous ring and eight rays anchored to the actual click, independent of subsequent pointer movement. No assets or routes were replaced.


Organization note: build tooling now lives in tools/, tests in tests/, current documentation in docs/, and unused local evidence in trash/. Earlier absolute paths describe historical evidence, not required project dependencies.
