# Vertical (Shorts) mode of the 3D engine

Same engine as `../engine3d`, with a vertical layout (720×1280 design space, rendered at 1080×1920).
Copy these files over the engine3d ones in a work folder (they still work for 16:9 when `VERT` is not set).

- `build_short.py`: one round as a Short. `TLOUT=tl_short8.json ROUND=8 python3 build_short.py` (no round wipe, no score bug; ends with a 2.6 s "FULL EPISODE ON THE CHANNEL" card).
- Render: `VERT=1 SHORT=1 TLFILE=tl_short8.json CHUNKS=chunks_s8 node run.js chunks <worker> 3`.
- Audio: `TLFILE=tl_short8.json MIXOUT=mix_s8.wav python3 mix.py` reuses the episode's voice files, so a Short costs no extra voice credits.
- Layout rules: the claim is fully visible on frame 0 (the hook), cameras get a wider field of view, Ricky's full-screen shots are scaled to the height and centred on him, his box sits in the lower half, chips are clamped to stay on screen.
- A 50 s Short takes about 15 minutes to render with 3 workers.
