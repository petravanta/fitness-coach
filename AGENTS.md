# Notes for coding agents

Follow the shared standards in https://github.com/petravanta/general/blob/main/STANDARDS.md (hub link, theme switch, shared look, phone and desktop layouts, light and dark themes, storage). This file only adds what's specific to Fitness Coach.

- The app is `index.html` with no build step. Serve the folder (`python3 -m http.server`) to run it; `data/` can't load from `file://`.
- Catalog content is data, not code: exercises, sports and equipment live in `data/*.json` with schemas in `data/schema/`. Add or change entries there, never as literals in `index.html`. The loader at the top of the script maps the readable JSON field names onto the short internal ones (`n`, `p`, `m`, `eq`, …).
- Exercise, sport and equipment ids are stored in people's workout history and profiles. Never rename or reuse one.
- A new movement pattern, muscle, quality or tracking type is a code change: update the constants in `index.html` and the enums in the schemas together.
- Run `node scripts/check-data.js` and the ajv commands in CONTRIBUTING.md after editing data.
- When you add a file the app needs offline, add it to `SHELL` in `sw.js` and bump `CACHE`.
