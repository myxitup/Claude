# Ricky: cartoon character kit

2D cartoon version of the channel's skeptic, **Ricky**. Art made by the user with their AI image tool; cut out and rigged by Claude. Same face, curly hair, dark teal tracksuit with cream stripes, black crossbody bag, cream trainers, thick black outlines, flat colours.

## What's here
| Folder | Contents |
|---|---|
| `rigset/` | Everything the rig draws: 24 full-body poses, 12 close-up heads (`h_` prefix), a mouthless copy (`__nm`) and a face mask (`__mask`) for every talking pose, and `faces.json` (mouth/eye boxes, skin colour) |
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
2. Lip sync: while talking the rig draws the **mouthless copy** of the pose (its drawn mouth removed, outline kept), then the drawn mouth for the current letter, **clipped by the face mask** so it can never cross the outline. Size: `w × 0.95 / rest width`; close-up heads use a fixed mouth width of 48 placed slightly in from the cheek edge (`mouthRemove` keeps the original box for the clean-up). Build the copies with `rig/mouthless.py` (keeps dark pixels within ~5 px of transparency = the outline).
3. Blinks every ~3 s **in wide shots only** (never in close-ups, where patches show), breathing bob, slight sway; laugh poses bounce.
4. Poses with open or special mouths (`shocked`, `excited`, `laugh`, `facepalm`, `thinking` head, etc.) keep their drawn mouth (`noLip`).
5. Alignment: each pose is anchored by its mouth x (or `ax`) and its feet (image bottom), so the head stays put between poses.

## Shot mix
Close-up heads are stored in the rig set with an `h_` prefix (`h_thinking`, `h_shocked`...). `rig.html` in MIX mode picks the framing from the name: `h_*` = close-up, `sit*` = couch, everything else = standing. Changing shot type is a hard cut with a punch-in; `rig_prep_mix.py` shows a cue list mixing all three.

## Adding new art
- Ask for **one pose per image**, full body, filling the frame, transparent background, using a pose sheet as the reference. One-per-image gets around the generator's ~1536 px size limit, so it comes out about 3× sharper.
- Cut out with `cutout2.py` (uses the image's own transparency), find eyes and teeth with `face_find.py`, add closed-mouth positions by hand from a zoomed grid, then add the entry to `faces.json`.
- Keep the user's own wording: the art is theirs and must stay original (never "in the style of" an existing show).

## In the round engine
`engine/round-ricky.html` loads `rig/rig_embed.html` in a hidden iframe (Chromium needs `--allow-file-access-from-files --disable-web-security`), calls its `render(T)` and draws its canvas either full-screen (opener, reaction) or into Ricky's box (pauses, countdown, decision). `scripts/ricky-timeline.py` builds his poses, mouth shapes and full-screen/box windows on the final video clock. "RICKY" replaces "KRIS" everywhere on screen. Ricky can also appear small inside scene art (e.g. shocked on Venus) using a pose image.
