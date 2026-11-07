# The skeptic: cartoon character kit

2D cartoon version of the channel's skeptic (working name "Kris" until the user names him). Art made by the user with their AI image tool; cut out and rigged by Claude. Same face, curly hair, dark teal tracksuit with cream stripes, black crossbody bag, cream trainers, thick black outlines, flat colours.

## What's here
| Folder | Contents |
|---|---|
| `poses/` | 24 full-body poses with transparent backgrounds + `faces.json` (mouth and eye boxes per pose, skin colour) |
| `heads/` | 12 chest-up expressions for the bust cam + `faces.json` |
| `mouths/` | 9 drawn mouths for lip sync + `mouths.json` (size and anchor) |
| `source-sheets/` | The original sheets as the user sent them |
| `rig/` | `rig.html` (renderer), `rigrun.js` (stills/video), prep and cut-out scripts |

### Poses
- Standing: `stand`, `point`, `facepalm`, `cross`, `laugh`, `shrug`, `thumbs`, `shocked`, `thinking`, `sideeye`, `annoyed`, `excited`, `pointyou`, `explain`, `remote`
- Sitting (couch corner): `sit`, `sitrelax`, `sitlean`, `sitpoint`, `sitfacepalm`, `sitlaugh`, `sitcross`, `sitremote` (button-press lines, use for PAUSE), `sitshocked`

### Expressions (bust cam)
`neutral`, `smirk`, `grin`, `shocked`, `sidegrin`, `skeptical`, `laughing`, `annoyed`, `thinking`, `unimpressed`, `disgusted`, `eyesclosed`

### Mouths
`rest`, `smile`, `slight`, `ah`, `ee`, `oh`, `oo`, `fv`, `mbp`. Letter mapping: a→ah; e/i/y→ee; o→oh; u/w/q→oo; f/v→fv; m/b/p→mbp; other letters→slight; silence→rest (the pose's own drawn mouth shows). Expression tags like [laughs] map to ah. Hold each shape at least 70 ms.

## How the rig works
1. Pose swaps on cue words from ElevenLabs word timings, with a 0.14 s crossfade and a small squash.
2. Lip sync: a skin-coloured patch covers the drawn mouth, then the drawn mouth for the current letter is placed on the mouth anchor, scaled to the face (`w × 0.95 / rest width`).
3. Blinks every ~3 s (eyelid patches over the eye boxes), breathing bob, slight sway; laugh poses bounce.
4. Poses with open or special mouths (`shocked`, `excited`, `laugh`, `facepalm`, `thinking` head, etc.) keep their drawn mouth (`noLip`).
5. Alignment: each pose is anchored by its mouth x (or `ax`) and its feet (image bottom), so the head stays put between poses.

## Adding new art
- Ask for **one pose per image**, full body, filling the frame, transparent background, using a pose sheet as the reference. One-per-image gets around the generator's ~1536 px size limit, so it comes out about 3× sharper.
- Cut out with `cutout2.py` (uses the image's own transparency), find eyes and teeth with `face_find.py`, add closed-mouth positions by hand from a zoomed grid, then add the entry to `faces.json`.
- Keep the user's own wording: the art is theirs and must stay original (never "in the style of" an existing show).

## Still to do
- Name the character, then replace "KRIS" in captions, the scoreboard and the "KRIS SAYS" sticker.
- Put the rig into the round engine in place of the stick-figure skeptic (couch corner and bust cam in the YouTube-pause overlay).
