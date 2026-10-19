# Fitness Coach

A browser-based gym coach. Tell it what equipment you have, which sports you play and which exercises you like, and it plans a workout that fits your time, runs it set by set with a rest timer, and tracks your strength by exercise and by movement.

## Try it

**[Open Fitness Coach → petravanta.github.io/fitness-coach](https://petravanta.github.io/fitness-coach/)**

It runs in any modern browser on phone or desktop. To get started:

0. Tap **Connect Google Drive**. Your data is kept in your own Drive.
1. Go to **Gear & goals**: tick your equipment, pick the sports you cross-train for, star the muscles you want to prioritise, and set the slider between *Look* (muscle and shape) and *Perform* (power and sport).
2. On **Exercises**, star your favorites. Plans pick them more often. **Add your own** for anything missing.
3. On **Today**, choose how long you have and a focus (or let it pick), then **Start workout**.

On a phone, add it to your home screen (see *On your phone* below).

## What it does

- **Plans that fit your time.** A workout is a warm-up plus blocks in priority order: main lift, supersets, sport carry-over, physique work and a conditioning finisher. If time is short it trims sets, then drops the lowest-priority blocks. Accessories are paired as supersets (push with pull, single-leg with core) so you rest less without losing quality.
- **Weight training and cross-training together.** *Pick for me* alternates full body, upper and lower based on what you trained recently. Each sport maps to qualities (skating: single-leg, lateral, posterior chain; tennis: rotation, lateral, power; and so on), and exercises that build those qualities get picked more as the slider moves toward *Perform*.
- **Focus between sets.** After each set a large rest timer starts. It beeps 10 seconds before the end and at zero, then turns red and counts how far over you go. You tap **Start set** to begin the next one, and the app records how close you stayed to the timer. The screen stays on during a workout.
- **Progressive overload.** Each exercise suggests a weight and reps from last time: add weight when you hit the top of the rep range on every set, otherwise add a rep. For an exercise you haven't done yet, it estimates a starting weight from your recent lifts for the same muscle and movement, a little on the light side. With no history at all, scored lifts start from a cautious guess based on your bodyweight (set it in Settings), and other weighted exercises from a sensible first weight in the library.
- **Shape the workout.** Every set is listed with its target. Drag blocks by their handle to reorder them (on the plan and during a workout), change the number of sets, swap an exercise from a searchable list, remove one, or add any exercise. During a workout you can also add or remove a set and tap any set to do or redo it. Tap an exercise on the plan to see its cues, planned sets and suggested weight before you start.
- **Pictures.** Every exercise has a small drawing that shows the movement, with the gear you'll use (barbell, dumbbells, kettlebell, cable or band) drawn in.
- **Templates.** Save a plan you like under **Templates** and load it again later. It keeps exercises, order, sets and rest, and weights are suggested fresh from your history each time.
- **Progress.** Per exercise: estimated 1-rep max (or best reps or time) over time. Per movement: a *movement strength* score for squat, hinge, single-leg, horizontal and vertical push and pull, carry and core, compared with bodyweight standards. Plus weekly sets per muscle and how well you kept to your rest times.

## Importing from Fitbod

Under *Settings → Import from Fitbod*, pick the CSV from Fitbod's *Export workout data*. Each workout becomes a workout here (warm-up sets are skipped), exercise names are matched to the library, and you choose what any unmatched exercise becomes. Importing the same file again skips workouts that are already in.

## Your data

Everything lives in **one file in your Google Drive**, `Fitness Coach data.json`: settings, workouts and a workout in progress. The first time you open the app it asks you to connect Google Drive; after that it saves a moment after every change, and any device you sign in on picks up the same data. The app uses the `drive.file` permission, so it can only see the file it created.

The browser keeps your Google sign-in and a copy of your data, so the app opens straight away even after the hour-long Google sign-in has run out; the next tap renews it (Google may flash a window that closes by itself), merges in Drive's copy and saves. One sign-in covers all of petravanta's apps on that browser. **Export backup** under *Settings* still downloads a JSON copy.

*Look around without saving* lets you try the app without connecting; nothing is kept.

## On your phone

Open the app in your phone's browser and use *Add to Home Screen* (Safari: Share → Add to Home Screen; Chrome: ⋮ → Install app). It then opens full-screen like an app, with the tabs along the bottom, and the app itself opens even without a connection. During a workout the screen stays on.

## Extending the app

What the coach knows lives in plain JSON files under [`data/`](data/), separate from the code, so you can read it, review it and add to it in a pull request without touching JavaScript. Each file has a schema that explains every field, and a check runs on every pull request.

| Dataset | File | Schema | What it controls |
| --- | --- | --- | --- |
| Exercises | [`data/exercises.json`](data/exercises.json) | [`exercises.schema.json`](data/schema/exercises.schema.json) | The exercise library: movement pattern, muscles, equipment options, how sets are logged, strength standards and coaching cues |
| Sports | [`data/sports.json`](data/sports.json) | [`sports.schema.json`](data/schema/sports.schema.json) | Sports you can cross-train for, and how much each relies on power, single-leg strength, rotation and so on |
| Equipment | [`data/equipment.json`](data/equipment.json) | [`equipment.schema.json`](data/schema/equipment.schema.json) | Equipment you can tick under *Gear & goals* |

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add an entry.

## Running it

It's a static page (`index.html`, the exercise library in `data/`, plus `manifest.webmanifest`, `sw.js` and icons for installing on a phone) with no build step. Serve the folder with any static server, for example `python3 -m http.server` and then open http://localhost:8000 (opening `index.html` straight from disk can't load `data/`), or with GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## Google Drive sync

The storage code is the shared Drive store from [petravanta/general](https://github.com/petravanta/general) (`shared/google-token.js` and `shared/drive-store.js`), inlined between their marker comments. When two devices have changes, every workout is kept and the most recently edited settings win.

It reuses Skating Mentor's OAuth client ID. That client already allows `https://petravanta.github.io`, which covers every app hosted there, so no new Google Cloud setup is needed. The Google sign-in window shows the app name set on the OAuth consent screen; rename it there (for example to *Petra's apps*) if you want one name for both apps.

## Shared look

The CSS between `Shared look` and `end shared look` is the same set of colors, fonts and components as Skating Mentor. Each app only overrides the `--accent` values below that block (pink for Skating Mentor, indigo here).
