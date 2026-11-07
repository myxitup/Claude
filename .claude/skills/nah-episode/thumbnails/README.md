# Thumbnail maker

Makes 1280×720 thumbnails in the channel style (bold rays background, Ricky with a white sticker outline, outlined Bangers headline, "TRUE OR FALSE?" chip) from a small JSON config, plus a phone-size preview strip.

## Run
```
ln -s <folder with node_modules/@fontsource> node_modules   # fonts: npm i @fontsource/bangers@5.0.8 @fontsource/patrick-hand@5.0.8
node make-thumbs.js round2-finland.json <out-dir>
```
Output: `<out-dir>/<name>.png` for each thumbnail and `<out-dir>/phone-preview.png`. Ricky's art comes from `../character/rigset/`.

## Config
```json
{
  "title": "The full video title (goes next to the thumbnail on YouTube)",
  "thumbs": [
    {
      "name": "finland-B-story",
      "bg": {"c1": "#ffb547", "c2": "#c2311f"},          // or {"type": "space"}
      "subjects": [{"type": "ticket", "amount": "€121,000", "y": 460}],
      "ricky": {"pose": "h_shocked", "x": 1000, "h": 640, "flip": false},
      "lines": [{"text": "PAID THIS", "color": "#fff"}, {"text": "FOR SPEEDING?!", "color": "#ffd23f"}],
      "chip": {"text": "TRUE OR FALSE?", "color": "#e5383b"}   // or false
    }
  ]
}
```
- **Headline lines** auto-shrink to fit `textMaxW` (default 700 px). Optional per line: `size`, `rot`.
- **Ricky poses:** any name from `character/rigset/` (close-ups `h_shocked`, `h_skeptical`, `h_unimpressed`, `h_disgusted`, ... or full body `pointyou`, `facepalm`, `shocked`...). Use `flip` to face him into the picture.
- **Subjects:** `ticket` (title, label, amount), `planet` (light, dark, face: sleepy/shocked, r), `hippo` (drops), `searchbar` (text), `mug`, `scoreboard` (ricky, facts), `image` (src relative to the config, key, x, y, h; for AI or hand-made art, drawn with a sticker outline). All take `x`, `y`.

## Rules (also in SKILL.md §12)
- 4–6 words that tell the story on their own; the title carries the full sentence.
- Ricky's face with a strong emotion that matches the claim, usually on the right.
- One big subject. Ask, never answer: no TRUE/NAH stamps on a thumbnail.
- No real logos (words like "Google" are fine; logos aren't).
- Make 2–3 versions per video for YouTube's **Test & Compare**.
