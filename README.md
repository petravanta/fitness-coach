# Fitness Coach

A browser-based gym coach. Tell it what equipment you have, which sports you play and which exercises you like, and it plans a workout that fits your time, runs it set by set with a rest timer, and tracks your strength by exercise and by movement.

## Try it

**[Open Fitness Coach → petravanta.github.io/fitness-coach](https://petravanta.github.io/fitness-coach/)**

It runs in any modern browser on phone or desktop, with no sign-up. To get started:

1. Go to **Gear & goals**: tick your equipment, pick the sports you cross-train for, star the muscles you want to prioritise, and set the slider between *Look* (muscle and shape) and *Perform* (power and sport).
2. On **Exercises**, star your favorites. Plans pick them more often. **Add your own** for anything missing.
3. On **Today**, choose how long you have and a focus (or let it pick), then **Start workout**.

On a phone, use *Add to Home Screen* to open it like an app.

## What it does

- **Plans that fit your time.** A workout is a warm-up plus blocks in priority order: main lift, supersets, sport carry-over, physique work and a conditioning finisher. If time is short it trims sets, then drops the lowest-priority blocks. Accessories are paired as supersets (push with pull, single-leg with core) so you rest less without losing quality.
- **Weight training and cross-training together.** *Pick for me* alternates full body, upper and lower based on what you trained recently. Each sport maps to qualities (skating: single-leg, lateral, posterior chain; tennis: rotation, lateral, power; and so on), and exercises that build those qualities get picked more as the slider moves toward *Perform*.
- **Focus between sets.** After each set a large rest timer starts. It beeps 10 seconds before the end and at zero, then turns red and counts how far over you go. You tap **Start set** to begin the next one, and the app records how close you stayed to the timer. The screen stays on during a workout.
- **Progressive overload.** Each exercise suggests a weight and reps from last time: add weight when you hit the top of the rep range on every set, otherwise add a rep.
- **Progress.** Per exercise: estimated 1-rep max (or best reps or time) over time. Per movement: a *movement strength* score for squat, hinge, single-leg, horizontal and vertical push and pull, carry and core, compared with bodyweight standards. Plus weekly sets per muscle and how well you kept to your rest times.

## Your data

Everything is stored in your browser (`localStorage`). Turn on **Google Drive sync** under *Settings* to keep a copy in your Drive and use it on several devices. **Export backup** downloads a JSON file you can import into any copy of the app.

## Running it

It's a single static file, `index.html`, with no build step. Open it in a browser, or serve it with GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## Google Drive sync

Works the same way as in [Skating Mentor](https://github.com/petravanta/skating-mentor): **Connect Google Drive** signs you in and keeps `Fitness Coach data.json` in your Drive, saved a few seconds after each change and merged when you connect another device (every workout is kept; the most recently edited settings win). It uses the `drive.file` permission, so it can only see the files it creates.

It reuses Skating Mentor's OAuth client ID. That client already allows `https://petravanta.github.io`, which covers every app hosted there, so no new Google Cloud setup is needed. The Google sign-in window shows the app name set on the OAuth consent screen; rename it there (for example to *Petra's apps*) if you want one name for both apps.

## Shared look

The CSS between `Shared look` and `end shared look` is the same set of colors, fonts and components as Skating Mentor. Each app only overrides the `--accent` values below that block (pink for Skating Mentor, indigo here).
