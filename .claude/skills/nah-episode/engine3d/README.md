# 3D episode engine (2.5D style)

Three.js 0.147 scenes (cel-shaded, black ink outlines) with Ricky's 2D cut-out rig drawn on top, rendered frame by frame in headless Chromium (SwiftShader) and piped to ffmpeg.

## Files
- `episode.html` loads the fonts first, then `core.js` (renderer, toon/ink helpers, camera keys), `sets.js` (studio, den, street, ocean, space ... one block per set), `hud.js` (captions, chips, bars, Ricky lip-sync drawing) and `main.js` (timeline → frame, overlays per segment).
- `build_tl.py` turns the voice files + round list into `tl.json` (segments, pauses, Ricky poses/visemes, captions).
- `mix.py` mixes voices (each clip levelled to the same loudness), music (ducked under speech), scene ambience and the sound kit in `sfx/` into `mix.wav`.
- `run.js`: `node run.js still 1.5,20,40 outdir 1` for test stills; `node run.js chunks <worker> <workers>` renders resumable 8-second chunks into `chunks/` (finished chunks are skipped, so a restart only loses the chunk in progress). Run 3 workers, then concat the chunks.
- **Cloud sessions:** start the render as a session-tracked background command (Bash run_in_background, 2-hour limit). A detached `setsid/nohup` process dies when the machine sleeps a few minutes after the session goes quiet. Re-run after the 2-hour limit to finish the remaining chunks.

## Making an episode
1. Write `narr.json` (narrator) and `ricky.json` (Ricky, v4 expression tags), voice them with `scripts/el_tts.py` (Ricky with `EL_MODEL=eleven_v4_exp`).
2. Edit the round list in `build_tl.py` and run it.
3. Add or reuse a set in `sets.js` for each topic; camera keys anchor to narrator words via `w('word')`.
4. Check stills, render, `python3 mix.py`, then `ffmpeg -i video.mp4 -i mix.wav` and `loudnorm=I=-14:TP=-1.5`.
5. Open on the question: the first claim must be on screen within 1–2 s (no logo intro).

Needs `node_modules` with `three@0.147.0` and `@fontsource/{bangers,patrick-hand}` next to `episode.html`; set `EP_DIR` to the folder holding `tl.json`, `vo/` and `parts/`.
Render speed here: about 1.5–2.5 s per frame per worker at 1080p, so ~1 hour for 3 minutes with 3 workers.
