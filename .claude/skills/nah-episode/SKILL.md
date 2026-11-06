---
name: nah-episode
description: Produce episodes, rounds and Shorts for the faceless YouTube channel "Nah, I Don't Believe That S-": a True-or-False facts game show with a stick-figure animation style, a calm narrator, and Kris, a skeptic who pauses the video to roast the facts. Use when the user asks to plan, script, voice, animate, render or publish a round, an episode, or a Short for this channel, or to add facts to the fact bank.
---

# Nah, I Don't Believe That S-

A faceless comedy-facts channel. Every round is a game: a wild claim, a build-up, a countdown, Kris's guess, and the reveal. Viewers play against Kris.

The user is the **final filter** on anything Kris says and on which voice takes are used. Draft, show, then generate.

---

## 1. Channel identity

| Item | Value |
|---|---|
| Channel name | Nah, I Don't Believe That S- |
| Handle | `@NahIDontBelieveThatS` (fallback `@NahIDontBelieveThat`) |
| Format line | TRUE OR FALSE? |
| Signature line | "Nah, I don't believe dat." |
| Verdict stamps | Green **TRUE** / red **NAH.** (or **FALSE**). Running joke: **TRUE\*** + "\*he still doesn't believe it" |
| Scoreboard | "KRIS 0 : 0 FACTS", updated every round |
| Episode ender | "Kris got 3/8. Did you beat him? Comment your score." |

Keep titles, thumbnails and the first seconds of every video **clean** (no swearing). The "S-" stays a hint.

---

## 2. Characters and voices

### Narrator
- Calm, clear explainer voice. Currently **Reader** (ElevenLabs voice id `UOcZh6rmTE0wZkipSyDT`).
- States the claim, builds suspense, explains the answer after the reveal.

### Kris: the skeptic
- Voice: **Kris Trinity Voice 2.0** (professional voice clone, id `83rbhwXDTY5EOkzvd7V6`).
- Model and settings must match the user's own takes: **`eleven_v4_exp`, stability 0.5, similarity 0.95.**
  - `eleven_multilingual_v2` and plain `eleven_v4` sound noticeably different. Do not use them for Kris.
  - Plain `eleven_v4` through the API ignores similarity; `eleven_v4_exp` applies it.
- Look: stick figure, backwards orange cap, purple hoodie, on a teal couch in a lamp-lit room, holding a remote. A red **NAH.** sticker on his window and a NAH. poster on the wall.
- Personality: unimpressed, laid back, funny comparisons to everyday life. Sometimes right, often wrong, sometimes refuses to accept the truth.

### Kris's style guide (London / UK street style)
Learned from the user's own lines. Use it, don't overdo it.
- "man" for he/him: *"man just dug through the whole planet"*
- "bruv", "bro", "ting", "innit", "yeah..." as a tag, "Rah" (surprise), "Behave" (no way), "lowkey", "peak"
- Grammar on purpose: *"my email don't reach me that fast"*, *"there ain't no lava"*
- Phonetic spelling so the voice says it right: *dat, anyfing, yu know, doin'*
- Comedy from everyday comparisons: Hulk Hogan, Wi-Fi, email, birthdays, roasting a marshmallow
- Never stack more than two slang words per sentence. If it reads like a costume, cut it.
- The user edits Kris's lines. Keep a running list of words they add or remove and follow it.

Examples the user approved:
- "Wait, man just dug through the whole planet... with a shovel? Some Hulk Hogan ting."
- "Bruv, eight kilometers a second? My email don't reach me that fast."
- "Ignore, yu know. Yeah, let's all act like there ain't no lava."
- "Nah. I don't believe dat. So man's birthday comes before he's even finished his day? Behave."
- "Rah. It was true?! ...Backwards as well? Venus is just doing whatever it wants, innit."

---

## 3. Episode structure (long form)

- **Length: 8 minutes or more** (YouTube only allows mid-roll ads from 8:00).
- **7 or 8 rounds**, about 60–80 seconds each.
- 15-second intro: "8 claims. Kris thinks he knows. Do you?"
- 20-second outro: final score, "send me claims in the comments".
- Mix topics every round: space, history, animals, body, food, money, weird laws, "what if" physics, viral TikTok/Instagram claims, myths everyone believes.
- Per episode: 2–3 trending claims, 4–5 evergreen facts, 1 "what if" centrepiece.
- Alternate TRUE and FALSE so viewers can't predict. Open with the strongest claim. Save a strong one for the end.

---

## 4. Round structure (the template)

| # | Beat | Who | What happens |
|---|---|---|---|
| 1 | **The claim** | Narrator | Card slams in, types along with the narrator. TRUE / FALSE pills pop. "TRUE OR FALSE?" tag top-left, scoreboard top-centre. |
| 2 | **Kris jumps in** | Kris | YouTube-style pause. He repeats the claim to himself, then "...Aight, let's see dis." |
| 3 | **Build-up** | Narrator | Clues and context, **never the answer**. Animated diagrams, side info card filling in, race bars to "?". |
| 4 | **Kris quips** (2–4) | Kris | YouTube-style pauses at sentence breaks: a joke or something he's surprised by. |
| 5 | **Lock it in** | Narrator | "True or false? Lock it in." Card returns, "COMMENT YOUR GUESS!" |
| 6 | **Kris thinks** | Kris | During the **5-second countdown** he talks it through out loud ("I dunno, man... sounds true"). His "KRIS SAYS" pick flips between TRUE and FALSE, resting on one as the count hits 0. |
| 7 | **Kris decides** | Kris | After the countdown: "Nah, I don't believe dat" (FALSE) or "Aight, I believe it" (TRUE). Pick locks. Flip-flopping against what he just said is part of the joke. |
| 8 | **Reveal** | — | Drumroll flashes, stamp slams with screen shake, his pick gets a red X if wrong (sad trombone), score flips. |
| 9 | **Why** | Narrator | Short, accurate explanation with the deciding numbers. |
| 10 | **Kris reacts** | Kris | "Rah, it was true?!" / "Told you, man." plus one more funny line. |
| 11 | **Next round** | — | Purple wipe, "ROUND N", running score. |

Kris's interruptions use the **YouTube pause** look: frame freezes and dims, big pause icon, "PAUSED" tag top-right, red progress bar, his couch corner slides in, he presses play to resume.

### Writing rules
- Build-up gives **clues and both sides**, the reveal gives the **deciding fact**. If the build-up gives it away, the countdown is pointless.
- Word facts precisely. Example: Venus takes 243 Earth days to **spin once** and about 225 to orbit, so "a day is longer than a year" is TRUE for one rotation (sunrise to sunrise is ~117 days, so say "spin once").
- Every verdict needs a reliable source. Keep sources in the fact bank and show them on screen.

---

## 5. Facts and trending claims

- Sources of claims: evergreen categories, viral TikTok/Instagram posts (vidIQ outlier search), viewer comments ("You sent it, I checked it").
- Viral posts are **where claims come from, not footage**. Never use their clips, audio, screenshots, usernames or faces. Retell the claim in our words and animate it ("This went viral on TikTok..." over a drawn phone).
- Health claims: YouTube is strict on medical misinformation. Debunking is fine only with accurate, sourced explanations.
- Roast the claim, never a real person.
- Avoid looking mass-produced: real commentary from Kris, varied scenes, checked facts. YouTube demonetizes "inauthentic" templated content.

---

## 6. Visual style

- **World:** hand-drawn stick figures with a line "boil" (12 fps jitter), cartoon planets and objects with faces, starfield backgrounds, soft vignette and paper grain.
- **Fonts:** Bangers (titles, buttons, captions), Patrick Hand (claim text, labels), JetBrains Mono (HUD numbers). From npm `@fontsource/bangers` and `@fontsource/patrick-hand`.
- **Colours:** ink `#1d1b24`, TRUE green `#2fae5b`, FALSE red `#e5383b`, gold `#ffd23f`, Kris purple `#7b4fd6`, space `#05061a`.
- **UI kit:** claim card with ROUND tag, TRUE/FALSE pills, countdown ring (gold, red on 2 and 1), verdict stamp (scales in, screen shake), scoreboard pill with flip animation, info card, race bars, Kris couch corner, YouTube pause overlay, word-by-word karaoke captions (current word gold; Kris's words red-pink with a purple KRIS tag).
- **Presenter:** the original stick figure with the red scarf, on a floating rock, pointing at the action.
- Cut visual transitions at least 0.1 s after a pause point so the frozen frame is clean.

---

## 7. Sound

- Synthesized in code, no samples: marimba/pluck game-show bed at ~116 bpm, ducked under voices; countdown ticks plus rising drone; drumroll into the stamp thud; three-note chime; sad trombone when Kris is wrong; whooshes, pops, sparkles; tape-stop click on every pause.
- Elevator-music style bossa for gag endings.
- Master to **-14 LUFS** (YouTube standard), true peak -1.5 dB.

---

## 8. Shorts

- Every round becomes a Short: **1080×1920, re-laid out for the phone, never cropped.**
- Top: channel name, big "TRUE OR FALSE?", claim card (stays the whole time; reveal stamp lands on it).
- Middle: the round's animation.
- Lower middle: big captions, 2–3 words at a time. Then the scoreboard.
- Keep the bottom ~300 px and the right edge clear of anything important (YouTube's buttons).
- Keep Kris's opener plus his best quip; cut the rest. Target **under 60 seconds**.
- End card: "Kris 0 : 1 Facts. Can you beat Kris? Comment your score ↓", then it loops.
- Link each Short to its full episode with YouTube's "related video".
- Next improvement: scenes designed tall so the middle is full, not the wide scene shrunk down.

---

## 9. Production pipeline

1. **Pick claims** (fact bank / vidIQ trending search). Check each verdict and note sources.
2. **Write the round script**: narrator lines plus Kris lines (opener, 2–4 quips, thinking line ≤ 5.5 s, decision, reaction). Show it to the user and apply their edits.
3. **Generate voices** with ElevenLabs `/v1/text-to-speech/{voice}/with-timestamps` so every word has a timing. Narrator: Reader. Kris: `eleven_v4_exp`, stability 0.5, similarity 0.95. One request per line.
   - If the user sends their own take, use it as-is and get word timings from `/v1/forced-alignment`.
4. **Build the timeline** (`scripts/timeline.py`): line start times, phrase cue times, word list for captions.
5. **Find pause points** at real silences in the narration (silence detection or the quietest 30 ms), so no word is clipped.
6. **Build the audio** (`scripts/audio.py`): music, SFX at the cue times, voices, ducking, Kris mouth-openness per frame.
7. **Insert Kris's pauses** (`scripts/pauses.py`, `SEL=0,1,2,3` picks which pauses; `SUF=_short` for a Short).
8. **Animate**: write the round's scenes as a JS module like `engine/round1-venus.js`, appended to `engine/base-engine.html`.
9. **Check stills** (`scripts/stills.js`) at every beat and every pause. Fix overlaps (captions vs. figures, labels vs. labels, transitions caught in a freeze).
10. **Render** in 3 parallel workers (`scripts/render-landscape.js`, `scripts/render-vertical.js`), join with ffmpeg, add audio, loudnorm.
11. **Encode a web copy** under 15 MB (`-crf 25 -tune animation`) for preview pages. Keep the full-quality file for YouTube.
12. **Publish** a preview page with the video and a beat-by-beat table, and send the file.

Tell the user when something can't be checked: Claude cannot listen to audio, so delivery and pronunciation are the user's call.

### Setup in a new session
- `npm i @fontsource/patrick-hand@5.0.8 @fontsource/bangers@5.0.8` next to the HTML engine (fonts load from `node_modules/`).
- Python with numpy; ffmpeg; Playwright's preinstalled Chromium.
- The scripts in `scripts/` are the Round 1 (Venus) reference: the cue phrases, line start times and pause points inside them are specific to that round and must be updated for each new round.
- ElevenLabs key is saved on the cloud environment for `api.elevenlabs.io` (header `xi-api-key`); vidIQ is connected for research and its assets host `assets.vidiq.com` is allowed.

---

## 10. Costs

- **ElevenLabs:** about 0.4 credits per character in practice; every model costs the same per line. A website generation gives two takes (v4 and v4 experimental) and only charges for one. A round's Kris lines ≈ 200–250 credits; a full round with narration ≈ 500–600. Starter plan: 36,395 per month (resets on the 25th). Two or three episodes a week needs the Creator plan (100k).
- **vidIQ:** 150 credits a month. Channel or YouTube search ≈ 5, TikTok/Instagram outlier search ≈ 5, voiceover 28 per 1,000 characters (prefer ElevenLabs for voices). Use vidIQ mainly for research: trends, keywords, titles.

---

## 11. Example: Round 1, Venus (TRUE)

See `examples/round1-venus/` for the exact lines and `engine/round1-venus.js` for the scenes.

- Claim: "A day on Venus is longer than its year."
- Build-up: Earth spins (24h) and laps the Sun (365 days); Venus is closer so its lap is shorter; but it spins really, really slowly; bars race to "?".
- Kris: opener "Hold on. A day... longer than a year? ...Aight, let's see dis." Quips about 24 hours not being enough, Venus cookin', and Wi-Fi (the user's own take). Thinking: "Closer to the Sun... spins slow... I dunno, man. Sounds true." Decision: FALSE. Reaction: "Rah. It was true?!"
- Reveal: TRUE. 243 vs 225 days, spins backwards, Sun rises in the west, Venus puts on sunglasses.
- Long version 1:18. Short 1:08 (opener + Wi-Fi quip only).
