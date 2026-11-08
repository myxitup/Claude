---
name: nah-episode
description: Produce episodes, rounds and Shorts for the faceless YouTube channel "Nah, I Don't Believe That S-": a True-or-False facts game show with a calm narrator and Ricky, a 2D cartoon skeptic who cuts in, pauses the video to roast the facts, and guesses before the reveal. Use when the user asks to plan, script, voice, animate, render or publish a round, an episode, or a Short for this channel, or to find, check or add facts to the fact bank.
---

# Nah, I Don't Believe That S-

A faceless comedy-facts channel. Every round is a game: a wild claim, a build-up, a countdown, Ricky's guess, and the reveal. Viewers play against Ricky.

The user is the **final filter** on anything Ricky says and on which voice takes are used. Draft, show, then generate.

---

## 1. Channel identity

| Item | Value |
|---|---|
| Channel name | Nah, I Don't Believe That S- |
| Handle | `@NahIDontBelieveThatS` (fallback `@NahIDontBelieveThat`) |
| Format line | TRUE OR FALSE? |
| Signature line | "Nah, I don't believe dat." |
| Verdict stamps | Green **TRUE** / red **NAH.** (or **FALSE**). Running joke: **TRUE\*** + "\*he still doesn't believe it" |
| Scoreboard | "RICKY 0 : 0 FACTS", updated every round |
| Episode ender | "Ricky got 3/8. Did you beat him? Comment your score." |

Keep titles, thumbnails and the first seconds of every video **clean** (no swearing). The "S-" stays a hint.

---

## 2. Characters and voices

### Narrator
- Calm, clear explainer voice. Currently **Reader** (ElevenLabs voice id `UOcZh6rmTE0wZkipSyDT`). The narrator is **voice only**: no on-screen character, no stick figures.
- States the claim, builds suspense, explains the answer after the reveal.

### Ricky: the skeptic
- **Look:** 2D cartoon (the user's own art): curly hair, dark teal tracksuit with cream stripes, black crossbody bag, cream trainers, thick black outlines, flat colours. Lives in a lamp-lit room with a teal couch, a night window and a "NAH." poster. See `character/README.md`.
- **Voice:** **Nah Skeptic (channel voice)**, id `hHAW0H4xGGxJkRLet8A5`, a Voice Design voice saved **privately** in the user's ElevenLabs account. It belongs to the channel and nobody can withdraw it. **Never share it to the Voice Library.** Design notes: `examples/voice-design.md`.
- **Model and settings:** `eleven_v4_exp`, stability 0.35, similarity 0.9. (`eleven_multilingual_v2` and plain `eleven_v4` sound different; plain v4 ignores similarity through the API.)
- **Expression tags on every line**, in square brackets before the words they colour: `[skeptical]`, `[chuckles]`, `[incredulous]`, `[surprised]`, `[laughs]`, `[scoffs]`, `[dismissive]`, `[thinking]`, `[sighs]`, `[shocked]`. They are performed, not read. Strip them from captions.
- **Personality:** unimpressed, laid back, funny comparisons to everyday life. **Sometimes right**, often wrong, sometimes refuses to accept the truth. Vary it so viewers can't just bet against him.
- Never use the old library voice "Kris Trinity" (id `83rbhwXDTY5EOkzvd7V6`): a real person's cloned voice, shared with 1,000+ accounts, withdrawable with 30 days' notice. "Kris" was a working name only.

### Ricky's style guide (London / UK street style)
Learned from the user's own lines. Use it, don't overdo it.
- "man" for he/him: *"man just dug through the whole planet"*, *"if man's rich, man has to pay more"*
- "bruv", "bro", "ting", "innit", "yeah..." as a tag, "Rah" (surprise), "Behave" (no way), "lowkey", "peak", "aight", "still" as a tag
- Grammar on purpose: *"my email don't reach me that fast"*, *"there ain't no lava"*, *"Finland don't play"*
- Phonetic spelling so the voice says it right: *dat, anyfing, yu know, doin'*
- Comedy from everyday comparisons: Hulk Hogan, Wi-Fi, email, birthdays, being broke
- Never stack more than two slang words per sentence. If it reads like a costume, cut it.
- The user edits Ricky's lines. Keep a running list of words they add or remove and follow it.

Lines the user wrote or approved:
- "Wait, man just dug through the whole planet... with a shovel? Some Hulk Hogan ting."
- "Bruv, eight kilometers a second? My email don't reach me that fast."
- "Ignore, yu know. Yeah, let's all act like there ain't no lava."
- "Nah. I don't believe dat. So man's birthday comes before he's even finished his day? Behave."
- "Wait... so if man's rich, man would have to pay more than someone who is poor even though we got caught doing the same speed... nah." (user's own line, Finland round)

---

## 3. Pacing and retention (the rules that matter most)

Based on YouTube's own model (appeal, engagement, satisfaction) as explained in the "six gates" video the user shared: every video must earn its way through **idea → click → promise (first ~5 s) → attention → payoff → more**.

- **First 4 seconds = the promise.** 0–2 s: claim card + "True or false?". 2–4 s: Ricky **cuts in** full-screen on the close-up for one short line (≈2 s), **no pause effect**, then straight into the facts. No intros, no "welcome back".
- **Opener lines rotate:** "Aight, let's see if this is true." / "Sounds false... but let's see." / "Nah. Prove it." / "Hmm. Go on then." / "Who's saying this? Let's see." / or a quick repeat of the claim ("A hundred grand? For speeding? Prove it.").
- **Ricky's screen time ≈ 12–15 s per round.** Viewers came for the facts.
  - Quick quips **≤ 2 s**, no long "..." pauses inside them. **Max 2 quips** per round; keep only the funniest.
  - **One "big disbelief" moment per round is allowed** when the claim is truly unbelievable: up to **6–8 s**, mid build-up, where it adds suspense. Best when his rant also explains the system to the viewer (see the Finland round).
  - His countdown line plays **over** the 5-second countdown, so it costs no time (keep it ≤ 5 s).
- **Pauses are fast:** freeze + pause icon + his box sliding in + resume ≈ **0.35 s overhead** (lead 0.2 s, tail 0.15 s), not 1 s.
- **Payoff:** the reveal must answer clearly, with the deciding numbers. **More:** end on the next round / next episode.
- Target round length ≈ **55–65 s** (Round 1 went from 1:24 to 0:56 with these rules).

---

## 4. Episode structure (long form)

- **Length: 8 minutes or more** (mid-roll ads from 8:00). **7 or 8 rounds**.
- Short intro: "8 claims. Ricky thinks he knows. Do you?" Outro: final score, "send me claims in the comments".
- **Mix categories every round:** history, laws & society, animals, places, the body, space & science, big internet/world stats, viral claims, "what if" scenarios.
- **About half TRUE, half FALSE**, alternated unpredictably. Open with the strongest claim; save a strong one for the end.
- **True facts that sound fake are a must** in every episode.
- Use the same *kind* of claim both ways (e.g. one true tech stat, one false tech stat) so viewers can't spot a pattern.

---

## 5. Round structure (the template, with Ricky)

| # | Beat | Shot | What happens |
|---|---|---|---|
| 1 | **The claim** (0–2 s) | Card | Card slams in, types along with the narrator; TRUE / FALSE pills pop. "TRUE OR FALSE?" tag, scoreboard. |
| 2 | **Ricky cuts in** (2–4 s) | Full-screen close-up, no pause | One short line. Hard cut in and out with a small flash. |
| 3 | **Build-up** | Diagrams | Clues and both sides, **never the answer**. Info card, race bars to "?". |
| 4 | **Quick pauses** (max 2) | YouTube-pause box: couch or close-up | ≤ 2 s each at sentence breaks. Optional: one **big disbelief** moment (standing, up to 6–8 s). |
| 5 | **Lock it in** | Card | "True or false? Lock it in." + "COMMENT YOUR GUESS!" |
| 6 | **Ricky thinks** | Box, close-up | Over the 5-second countdown he talks it through; the "RICKY SAYS" pick flips TRUE/FALSE and rests on one at 0. |
| 7 | **Ricky decides** | Box, standing (pointing at the viewer) | "Nah. Don't believe dat." (FALSE) or "Aight, I believe it." (TRUE). Flip-flopping against what he just thought is part of the joke. |
| 8 | **Reveal** | — | Drumroll flash, stamp + screen shake, his pick gets a red X if wrong (sad trombone), score flips. |
| 9 | **Why** | Diagrams | Short, accurate explanation with the deciding numbers. Ricky can appear small inside the scene art (e.g. shocked on Venus). |
| 10 | **Ricky reacts** | Full-screen, standing | Shocked → excited / "Told you, man!" plus one funny tag line. |
| 11 | **Next round** | — | Purple wipe, "ROUND N", "RICKY x : y FACTS". |

**Shot rules:** close-up for quips and thinking; couch for idle and the remote/pause click; standing for big reactions. Changing shot type is a hard cut with a punch-in and a quick flash; pose changes inside a shot crossfade.

**YouTube-pause look:** frame freezes and dims, big pause icon, "PAUSED" tag top-right, red progress bar, Ricky's box slides in with a red "RICKY" sticker, play icon on resume.

### Writing rules
- Build-up gives **clues and both sides**; the reveal gives the **deciding fact**. If the build-up gives it away, the countdown is pointless.
- Word facts precisely (e.g. Venus takes 243 Earth days to **spin once**; say "spin once", because sunrise-to-sunrise is ~117 days).
- Every verdict needs a reliable source, kept in the fact bank and shown on screen with the year ("Source: ITU, 2025").

---

## 6. Facts: the fairness rule and the fact bank

- **Fairness rule:** a FALSE claim must be wrong **by a mile**: at least **~10× off**, the **opposite**, or **the wrong thing entirely**. Never a nitpick ("1 billion" vs "1.5 billion"; "a Mars day is exactly 24 h" when it's 24 h 39 m). Viewers must feel the reveal was fair.
- FALSE claims should still **sound believable**: build them on a real fact with one big twist ("Scientists have found...", "In Japan it's illegal to...").
- **TRUE claims that sound fake** are the best rounds. Always have several per episode.
- **Big stats go out of date** (Google, WhatsApp, YouTube, Amazon). Re-check them when each episode is made.
- Verified claims with sources: `examples/fact-bank.md`. Add to it; re-verify anything older than a few months before use.
- **Avoid:** health claims (YouTube is strict on medical misinformation; debunk only with accurate sources), claims about named private people, defamation. Roast the claim, never a person.
- **Viral TikTok/Instagram claims** are where claims come from, not footage. Never use their clips, audio, screenshots, usernames or faces. Retell in our words and animate it.
- Avoid looking mass-produced: real commentary from Ricky, varied scenes, checked facts.

---

## 7. Visual style

- **World:** cartoon objects with faces (planets, Sun, etc.), starfield or themed backgrounds, soft vignette. **No stick figures anywhere** (the old narrator stick figure was removed).
- **Ricky:** the cut-out rig in `character/` (24 poses, 12 close-up expressions, 9 drawn mouths). Details in `character/README.md`.
  - Lip sync uses **mouthless face copies** plus the drawn mouths **masked to the inside of his face**, so mouths never cross his outline.
  - **Blinks only in wide shots** (standing/couch), never in close-ups.
- **Fonts:** Bangers (titles, buttons, captions), Patrick Hand (claim text, labels), JetBrains Mono (HUD numbers). npm `@fontsource/bangers`, `@fontsource/patrick-hand`.
- **Colours:** ink `#1d1b24`, TRUE green `#2fae5b`, FALSE red `#e5383b`, gold `#ffd23f`, Ricky purple `#7b4fd6`, space `#05061a`.
- **UI kit:** claim card with ROUND tag, TRUE/FALSE pills, countdown ring (gold, red on 2 and 1), verdict stamp, scoreboard pill with flip, info card, race bars, Ricky box with "RICKY" sticker, YouTube pause overlay, word-by-word karaoke captions (current word gold; Ricky's words red-pink with a purple "RICKY" tag).
- Cut visual transitions at least 0.1 s after a pause point so the frozen frame is clean.

---

## 8. Sound

- Synthesized in code, no samples: marimba/pluck game-show bed (~116 bpm) ducked under voices; countdown ticks + rising drone; drumroll into the stamp thud; chime; sad trombone when Ricky is wrong; whooshes, pops; short tape-stop click on every pause.
- Master to **-14 LUFS** (YouTube standard), true peak -1.5 dB.

---

## 9. Shorts

- Every round becomes a Short: **1080×1920, re-laid out for the phone, never cropped.**
- Top: channel name, big "TRUE OR FALSE?", claim card (stays; reveal stamp lands on it). Middle: the round's animation. Lower middle: big captions (2–3 words), then the scoreboard.
- Keep the bottom ~300 px and the right edge clear (YouTube's buttons).
- Keep Ricky's opener plus his best quip. Target **under 60 seconds**.
- End card: "Ricky 0 : 1 Facts. Can you beat Ricky? Comment your score ↓", then it loops. Link each Short to its episode ("related video").
- Next improvement: scenes designed tall so the middle is full.

---

## 10. Production pipeline

1. **Pick claims** from `examples/fact-bank.md` or new research (web search to verify; vidIQ for trends). Apply the fairness rule.
2. **Write the round script** (narrator + Ricky: opener ≤ 2 s, ≤ 2 quips, optional big-disbelief line, countdown line ≤ 5 s, decision, reaction). Show it to the user; apply their edits.
3. **Generate voices** with ElevenLabs `/v1/text-to-speech/{voice}/with-timestamps` (one request per line). Narrator: Reader. Ricky: `hHAW0H4xGGxJkRLet8A5`, `eleven_v4_exp`, stability 0.35, similarity 0.9, tags. User takes: use as-is, word timings via `/v1/forced-alignment`.
4. **Timeline** (`scripts/timeline.py`): line start times (opener right after the claim; build-up 0.25 s after), cue phrases, caption words (tags stripped).
5. **Pause points** at real silences in the narration.
6. **Audio** (`scripts/audio.py`): music, SFX at cues, voices, ducking.
7. **Ricky's pauses** (`scripts/pauses-fast.py`: lead 0.2 s, tail 0.15 s).
8. **Ricky's timeline** (`scripts/ricky-timeline.py`): per line, shot/pose cues by phrase, mouth shapes per letter, and which lines are full-screen vs box.
9. **Animate:** round scenes as a JS module (like `engine/round1-venus.js`) in the base engine; Ricky is drawn by the rig in a hidden iframe (`engine/round-ricky.html` + `character/rig/rig_embed.html`).
10. **Check stills** at every beat and every pause; fix overlaps.
11. **Render** in 3 parallel workers (`scripts/run-ricky.js`, Chromium launched with `--allow-file-access-from-files --disable-web-security` for the rig iframe), join, add audio, loudnorm.
12. **Web copy** under 15 MB (`-crf 25 -tune animation`); keep the full file for YouTube. **Publish** a preview page with a beat table; send the file.

Claude cannot listen to audio: delivery and pronunciation are the user's call. Say so.

### Setup in a new session
- `npm i @fontsource/patrick-hand@5.0.8 @fontsource/bangers@5.0.8` next to the HTML engine.
- Python with numpy and Pillow; ffmpeg; Playwright's preinstalled Chromium.
- The scripts are the Round 1 (Venus) reference: cue phrases, start times and pause points are specific to that round.
- ElevenLabs key is saved on the cloud environment for `api.elevenlabs.io` (header `xi-api-key`). vidIQ is connected; `assets.vidiq.com` is allowed.

---

## 11. Costs

- **ElevenLabs:** ≈ 0.4 credits per character; every model costs the same per line. A full round (narrator + Ricky) ≈ 400–600 credits. Starter plan 36,395/month (resets on the 25th); 2–3 episodes a week needs Creator (100k).
- **vidIQ:** 150 credits/month. Searches and transcripts ≈ 5 each. Use it for research, not voices.

---

## 12. Thumbnails

The thumbnail decides the click (the "click" gate). Mock-ups and the headline test: `thumbnails/`, maker: `thumbnails/make-thumbs.js` (see `thumbnails/README.md`).

- **Ricky's face, big, with a strong emotion** that matches the claim (shocked, skeptical, unimpressed, disgusted), usually on the right, with a white sticker outline. He is the channel's recognisable face.
- **4–6 words that tell the story on their own**, huge with a thick black outline. Not 2 words that need explaining ("FOR SPEEDING?!"), not 8+ words that shrink on a phone ("THEY PAID THIS MUCH FOR A SPEEDING TICKET?"). Best: "PAID THIS / FOR SPEEDING?!".
- **The title carries the full sentence:** "They Paid €121,000 for a Speeding Ticket... True or False?". Thumbnail and title split the job.
- **One big, clear subject** (the ticket, the planet, the hippo). Bold colour with sunburst rays.
- **Ask, never answer.** "?" or "?!". **No TRUE / NAH stamps** on a thumbnail (it kills the curiosity gap).
- **Deliver the promise:** the video must answer exactly what the thumbnail asks.
- **No real company logos** (the word "Google" is fine; its logo isn't).
- Small "TRUE OR FALSE?" chip as branding.
- **Make 2–3 versions per video** and run YouTube Studio's **Test & Compare** (up to 3 thumbnails; YouTube picks by watch time). Track which styles win and update these rules.
- Always check the phone-size preview before choosing.

---

## 13. Examples

- **Round 1, Venus (TRUE)** — `examples/round1-venus/`, `engine/round1-venus.js`. Ricky version 0:56: opener "A day longer than a year? Prove it."; couch quip "Twenty-four hours ain't enough, man."; close-up "Slower than my Wi-Fi? Nah."; countdown "Closer to the Sun... I dunno, man. Sounds true."; decision "Nah. Don't believe dat." (wrong); full-screen "Rah! It was true?!".
- **Round 2, Finland speeding fine (TRUE)** — `examples/round2-finland.md`: the model for a "big disbelief" moment, and a round where Ricky gets it right.

---

## 14. Weekly schedule, Shorts and the 3D pipeline (added after Episode 1)

- **Weekly rhythm:** the full episode goes out **Friday**; one Short a day **Saturday–Thursday** (6 Shorts). Each 8-round episode gives 7–8 Shorts, so keep **one spare** (TikTok/Reels, or a backup). Schedule all 7 uploads at once in YouTube Studio, same time each day, and link every Short to the episode with "Related video".
- **Deadline:** the week's episode is finished by Thursday. Render ≈ 3 h for 8 min (16:9) + ≈ 15 min per Short, so start the weekly session by Wednesday.
- **Balance:** plan **4 TRUE / 4 FALSE** per episode. Post the Shorts in an order with no rhythm (not T-F-T-F, not long runs). Ricky's picks must not follow a pattern either (e.g. not always wrong on TRUE ones). He's right about 3 times in 8.
- **Shorts format (vertical 9:16, `engine3d-vertical/`):** one round each, 45–60 s. The claim is fully on screen **on frame 0**. No round wipe, no score bug. **3-second countdown** with its own ≤ 3 s thinking line for Ricky. **Looping ending:** cut straight from Ricky's last word back to the question, no fade, no end card. A small "FULL EPISODE ON THE CHANNEL" banner sits at the top during his reaction. Shorts reuse the episode's voices (no extra voice cost apart from the short thinking line).
- **Episode ending:** after the next-episode teaser, a 12 s end screen (room for YouTube's end-screen elements). Ricky says the like-and-subscribe line in his box ("Like and subscribe, or I'm takin' it personal, bruv."), then the SUBSCRIBE and SEND US A COMMENT buttons pop in.
- **Opening:** the first claim must be on screen in the first 1–2 s. The channel title beat ("That's round one. Seven more claims...") comes **after** round 1, not before.
- **Variety (avoid looking mass-produced):** rotate formats every few episodes (lightning round, theme episode, viewer claims, rematch); let Ricky evolve (season score, callbacks); vary pacing (not every round needs a pause); change studio colours, camera paths and room props; the user writes or rewrites some of Ricky's lines every week.
- **Rendering in the cloud:** see `engine3d/README.md`. Render in resumable 8 s chunks as a session-tracked background task. Small fixes only redraw the chunks they touch (end text ≈ 5 min, one round ≈ 15–20 min; audio-only changes need no redraw).
