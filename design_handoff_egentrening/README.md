# Handoff: Egentreningsapp – Driv Fotball J2013

## Overview
A mobile-first self-training ("egentrening") web app for a girls' football team (J2013, ages 12–13). It motivates players to complete training sessions on their own over the summer. Players get a weekly program (2 sessions/week), a step-by-step session player with timers and checklists, personal records, badges, a streak counter, personalized cheer messages, and "how-to" video links. All progress is stored locally on the device — **no backend/server.**

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing the intended look and behavior, **not production code to copy directly.**

- `Egentrening J2013.dc.html` — the source. It is a "Design Component" authored in a proprietary in-house format: an `<x-dc>` template + a `class Component extends DCLogic` logic class (React-like, runs on a custom `support.js` runtime). **Do not ship this format.** Read it to understand structure, content, and behavior.
- `Driv Egentrening J2013.html` — a fully self-contained, bundled build of the same app (all fonts/JS inlined). Open it in a browser to see and click the real thing. Use it as the behavioral source of truth.
- `assets/driv-logo.png` — the club logo (used on the welcome screen).

The task is to **recreate this design in the target codebase's environment** (React, Vue, SwiftUI, native, etc.) using its established patterns. If no environment exists yet, React + plain CSS (or React Native for a true mobile app) is a natural fit — the logic is already structured like a React class component.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and interactions are all defined. Recreate the UI faithfully. Exact tokens are listed below; you can also read them straight out of the source file.

## Screens / Views
The app is a single-component state machine with four views, switched by a `view` state variable (`'name' | 'home' | 'session' | 'done'`). Phone frame is max-width **430px**, centered, on a warm cream page background.

### 1. Name / Welcome (`view === 'name'`)
- **Purpose:** First-run only. Player enters her first name (stored locally). Shown when no saved name exists. Also reachable via the ✏️ edit button on Home.
- **Layout:** Full-screen, deep blue (`#23347a`) background, centered column, 32px/30px padding.
- **Components:**
  - Logo tile: 72×72px, white, 20px radius, `box-shadow: 0 4px 16px rgba(0,0,0,0.22)`; logo image 54px wide inside.
  - Title "Velkommen!" — Copernicus Bold serif, 30px, white, letter-spacing −0.01em, 22px top margin.
  - Subtitle — Inter 400, 15px/22px, white at 80% opacity, max-width 280px.
  - Text input — full width (max 300px), 15px/18px padding, white bg, 14px radius, Inter 600 17px, color `#23347a`, centered text, no border, no outline. Placeholder "Fornavnet ditt". Submits on Enter.
  - Primary button "Kom i gang ⚽" — red `#c71f40`, white text, Inter 700 17px, 16px padding, 14px radius, full width (max 300px).
  - Text button "Hopp over" — transparent, white at 55% opacity, Inter 600 14px.

### 2. Home / "Min uke" (`view === 'home'`)
- **Purpose:** Weekly overview. Pick a session to start; see streak, progress, badges, records, and a dynamic summer message.
- **Layout:** Cream background `#fbf8f3`, 36px bottom padding, vertical stack of sections with 20px horizontal gutters.
- **Components (top to bottom):**
  - **Header row:** Title "Egentrening" (Copernicus Bold 26px, `#17001e`) + subtitle "Driv Fotball · Jenter 2013" (Inter 600 13px, `#6b6761`). Right side: ✏️ edit-name button (38×38px round, `rgba(255,255,255,0.12)` bg) — note this sits inside the dark streak hero in the current build.
  - **Week switcher:** pill with `‹ Uke N ›` chevrons (white bg, 1px `#c3bdb6` border, full radius). Clamps week 1–12.
  - **Streak hero card:** dark `#17001e`, 20px radius, 18/20px padding. Left: flame icon in a 52px circle (`rgba(255,164,36,0.18)` bg, `#ffa424` icon) + streak number (Roboto Mono 700 30px) + "på rad" + greeting line. Right (divided by a hairline): "N / 2" sessions done this week (Roboto Mono 700 20px, `#ffa424`) + "denne uka".
  - **Summer note card:** `#fff4e0` bg, 1px `#ffe1ad` border, 18px radius. ☀️ in a 42px white tile + title (Inter 700 14px, `#23347a`) + body (Inter 400 13px/19px, `#6b6761`). **Text is dynamic** — see Interactions.
  - **Sessions list** (label "ØKTENE DENNE UKA", uppercase Inter 700 11px, letter-spacing 0.08em, `#a29c95`): 2 session cards. Each: white, 1px `#c3bdb6` border, 18px radius, 14px padding, `box-shadow: 0 2px 12px rgba(66,64,61,0.06)`. 58×58px tinted icon tile (16px radius) + kicker label ("Økt 1 · Kondisjon") + title (Inter 700 17px, `#17001e`) + meta row (⏱ duration, 📋 N øvelser). Right: either a green "✓ Gjort" pill (`#e3f2db` bg, `#19430a` text) or a 38px round yellow ▶ play button (`#ffa424` bg, `#17001e` icon).
  - **Badges** (label "MERKER"): horizontal scroll of 6 badges. Each: 64px circle + label. Earned = `#fff8e9` bg / `#ffe5b9` border / emoji full color; locked = `#f3eee6` bg / `#e6e0d7` border / dimmed.
  - **Records** ("DINE REKORDER"): white card split in two. Left: ⚽ tile (`#ebe0f5`/`#7732b9`) + "berøringer/min" PB (Roboto Mono 700 22px). Right: 🎯 tile (`#ffe5b9`/`#e02e04`) + "treff på mål" PB "N / 10".

### 3. Session player (`view === 'session'`)
- **Purpose:** Walk the player through one session, step by step.
- **Layout:** Full-screen dark `#17001e`, white text, flex column. Sticky header + progress bar at top, scrollable content, sticky CTA footer.
- **Components:**
  - **Header:** back-arrow button (38px round, `rgba(255,255,255,0.08)`), centered kicker (session kind) + "Steg X av Y", close button (×).
  - **Progress bar:** 6px track `rgba(255,255,255,0.12)`, fill `#ffa424`, width = `stepIndex / totalSteps`, `transition: width 0.35s ease`.
  - **Step heading:** name (Copernicus Bold 28px) + detail line (Inter 400 15px/22px, white 68%).
  - **Video links** (when the step has videos): label "🎬 Se hvordan" + pill links (`rgba(255,255,255,0.12)` bg). Open YouTube search URLs in a new tab.
  - **Step body — one of four types:**
    - `timer`: circular SVG countdown (172px, `#ffa424` stroke on `rgba(255,255,255,0.12)` track, `stroke-dasharray: 326.73`), MM:SS in Roboto Mono 700 38px, Start/Pause + Nullstill buttons. Counts down once/sec.
    - `checklist`: rows of exercises. Each row: a toggle button (radio_unchecked → check_circle, green `#43c878` when done) + label; checked rows tint green (`rgba(67,200,120,0.18)` bg). Strength rows also have a "🎬 Video" link on the right.
    - `challenge`: "mot deg selv" counter. − / + round buttons around a big number (Roboto Mono 700 56px, `#ffa424`), unit label, and a "Din rekord: N" pill. Saves a new PB on finish if beaten.
    - `do`: a plain "do it at your own pace" card with a 128px circular icon.
  - **Tips** ("SLIK GJØR DU"): bullet pills (`rgba(255,255,255,0.07)`).
  - **Cheer line:** ⚡ + rotating encouragement (Inter 600 14px, `#ffa424`).
  - **Footer (sticky):** primary CTA (yellow `#ffa424`, `#17001e` text, Inter 700 17px, 14px radius) labeled "Neste øvelse" / "Fullfør økt" / "Lagre og fullfør"; below it a "Hopp over" text button.

### 4. Done / Celebration (`view === 'done'`)
- **Purpose:** Celebrate a completed session.
- **Layout:** Full-screen yellow `#ffa424`, `#17001e` text, centered, with falling-confetti animation (CSS `@keyframes j13fall`, ~10 colored spans).
- **Components:** 104px dark trophy circle (pop-in animation) + headline (Copernicus Bold 40px, **personalized**, e.g. "Heia, Emma!") + "Du fullførte «…»" + two stat cards (streak flame + kind check) + optional record pill (dark, pulsing) + optional "Nytt merke: …" dashed pill + "Tilbake til uka" button (dark `#17001e`).

## Interactions & Behavior
- **Navigation:** `view` state switches screens. Home → tap session → `session`; finishing the last step → `done`; "Tilbake til uka" → `home`.
- **Week switcher:** ± changes `week` (clamped 1–12), which re-resolves which two sessions show.
- **Session resolution (important program logic):**
  - **Økt 1** alternates by week parity: **odd weeks → Jogging** (`jogg`), **even weeks → Strength** (`styrke`).
  - **Økt 2** rotates every week through **A / B / C**: index = `(week - 1) % 3` → `['A','B','C']` (A = ball control/dribbling, B = passing/receiving, C = finishing/speed).
- **Timer:** one `setInterval` (1s) decrements `timerLeft` while `timerRunning`. Start/pause/reset; restarts from full when finished.
- **Checklist:** per-row boolean toggles in `checks[]`. Reset per step.
- **Challenge counter:** `challengeVal` via ±; on finish, if it beats the stored PB (`pb.touches` or `pb.targets`) it saves a new record and the Done screen shows a "Ny rekord" pill.
- **Completion:** marks `completed["<week>-<okt1|okt2>"] = true`, increments `totalDone` and `streak`, recomputes earned badges, picks a personalized random cheer headline ("Bra jobba/Sterkt/Heia/Stå på/Supert" + name), switches to `done`.
- **Dynamic summer note** (Home) by week + sessions-done-this-week:
  - both done → "Uke N i boks! 🎉 …";
  - one done → "Bra start på uke N! …";
  - week ≥ 4 & none done → "Hold det gående i ferien ☀️ …";
  - else → "God sommer[, navn]! ☀️ …".
- **Dynamic greeting** in the streak hero follows the same none/one/both logic, with the name interpolated.
- **Animations:** confetti fall (`j13fall`), trophy pop (`j13pop`), record pill pulse (`j13pulse`). Card/button hovers should follow Kolibri norms (120–160ms ease-out) if you add them.

## State Management
Single component state (persisted to `localStorage` key `j2013_progress` as JSON):
- `progress`: `{ name?: string, completed: {[key]: true}, pb: { touches?: number, targets?: number }, streak: number, totalDone: number }`
- Transient UI state: `view`, `week`, `activeSession` (`'okt1'|'okt2'`), `stepIndex`, `timerLeft`, `timerRunning`, `checks[]`, `challengeVal`, `nameInput`, `lastDone`.
- **No data fetching, no server.** Everything is local to the device/browser. (A coach-wide dashboard would require a backend — explicitly out of scope.)
- A "demo data" flag seeds a sample state (streak 4, some completed, PBs) for previewing; ship with empty state.

## Design Tokens
Built on the **Kolibri Design System** (Oda). Pull exact values from `colors_and_type.css` in the Kolibri project where possible.
- **Colors:**
  - Cream page bg `#fbf8f3`; warm page wrapper `#e7e3da`; card white `#ffffff`.
  - Blackcurrant (dark surfaces/text) `#17001e`.
  - Egg Yolk (primary CTA/accent) `#ffa424` (hover `#ff8c1a`, pressed `#f07c00`).
  - Grape (purple accent) `#7732b9`; tints `#ebe0f5`.
  - Driv blue `#23347a`; Driv red `#c71f40`; Oda red `#e02e04`.
  - Green (done) `#43c878` / pill bg `#e3f2db` / text `#19430a`.
  - Summer card `#fff4e0` bg, `#ffe1ad` border.
  - Neutral border `#c3bdb6`; muted text `#6b6761`; dimmed label `#a29c95`.
- **Typography:**
  - Display serif: **Copernicus Bold** (700 only) — titles/headlines.
  - UI sans: **Inter** (400/500/600/700) — body, labels, buttons.
  - Mono: **Roboto Mono** (700) — numbers (streak, timer, PBs).
- **Radii:** chips/tiles 12–16px; cards 16–20px; buttons 14px; pills/circles 9999px.
- **Shadow:** card `0 2px 12px rgba(66,64,61,0.08)`.
- **Spacing:** 4px grid; common gutters 20px, card padding 14–16px.

## Instructional media (videos + images)
Some session steps carry **how-to media**, shown as a "🎬 Se hvordan" row (videos) or a thumbnail (images):
- **In-app video player.** Steps with `videos: [{ label, embed: '<YouTubeID>' }]` render pill buttons that open an **in-app modal** with an embedded YouTube player (`https://www.youtube.com/embed/<ID>?autoplay=1&playsinline=1&rel=0`) in a 9:16 frame — NOT a redirect to YouTube. (Use unlisted YouTube videos; YouTube was chosen over Instagram because it needs no login.) A legacy `videos: [{ label, url }]` form also exists that opens an external link in a new tab — but current content uses `embed`.
- **In-app image viewer.** The strength circuit shows a **photo per exercise** instead of video. Each checklist item is `{ label, img: 'assets/ovelser/<name>.jpg' }`; the row renders a 42×52 thumbnail that opens the full image in a modal. Images are built as `React.createElement('img', …)` in the logic (NOT `<img src="{{hole}}">`) so the offline bundler doesn't choke on dynamic paths.
- **Bundling note:** because video/image paths only exist as runtime JS strings, the 5 exercise photos are declared as `<meta name="ext-resource-dependency" content="assets/ovelser/*.jpg">` in `<helmet>` so the standalone build inlines them. In a real codebase, just `import`/bundle them normally.

## Assets
- `assets/driv-logo.png` — Driv Fotball club logo (welcome screen + name screen tile).
- `assets/ovelser/*.jpg` — exercise photos for the strength circuit: `kneboy`, `utfall`, `pushups`, `situps`, `rygghev` (860px-wide JPEGs, ~115 KB each; originals were 1792×2400 PNGs, downscaled for app weight).
- **Fonts:** Copernicus Bold + Inter are brand-licensed (in the Kolibri project's `fonts/`). Roboto Mono and Material Symbols Rounded (icons) load from Google Fonts.
- **Icons:** Material Symbols Rounded (e.g. `local_fire_department`, `play_arrow`, `check_circle`, `schedule`, `timer`, `arrow_forward`, `edit`, `close`). Badge/record glyphs use **emoji** (🌟 💪 ⚽ 🔥 ✅ 🎯) — this is a deliberate, kid-friendly exception to Kolibri's usual no-emoji rule.

## Program content (from the coach's plan — current version)
Recreate the exercise data exactly — it lives in the `SESSIONS` object in the source file. This reflects the latest edits:
- **Jogging:** 5 min warm-up → 18 min easy jog → 4×20s strides → 5 min cool-down.
- **Strength ("Styrkesirkel"):** light warm-up → **3 rounds** of {10 squats, 8 lunges/leg, 10 push-ups, **10 sit-ups**, 15 back extensions} with 1 min rest between rounds → stretch. *(Plank was replaced by sit-ups; the "20 jumps" exercise was removed.)* Each of the 5 exercises shows a **photo** (`assets/ovelser/*.jpg`), not a video.
- **A – Ball control:** "Triksing" (juggling/free play), dribbling (inside/outside/sole), feints (stepover, Cruyff, inside hook), 1-min touches challenge (with a clear instruction + tips). Dribbling has 1 embedded video; feints have 3 embedded videos (stepover `dQfDy9Mqmhc`, Cruyff `EEwIxwUZjdo`, inside hook `vX84ATVR0F8`); føring `J6U-YClb6AM`.
- **B – Passing/receiving (5 steps):** warm-up, 50 passes right, 50 left, one-touch (against a wall — no video), 20 clean passes, 20 weak-foot. *("Mottak med vending" / receive-and-turn was removed; the one-touch video was removed.)* All B drills work solo against a wall.
- **C – Finishing/speed:** ball warm-up, 10 sprints, shooting (right/left/after dribble), "hit target 10×" challenge.

> All exercises are designed to be done **alone** — the only thing needing a surface is wall-passing (solo against a wall).

## Files
- `Egentrening J2013.dc.html` — source design component (template + logic + content). Primary reference.
- `Driv Egentrening J2013.html` — self-contained runnable build (open in a browser to interact).
- `assets/driv-logo.png` — logo.
- `assets/ovelser/*.jpg` — strength-exercise photos.
