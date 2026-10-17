# Contributing

The easiest way to help is to add to the exercise library, the sports list or the equipment list. They're plain JSON files in [`data/`](data/), and you don't need to know any JavaScript.

## Add an exercise

1. Open [`data/exercises.json`](data/exercises.json) on GitHub and click the pencil icon to edit it. GitHub makes a copy for you if needed.
2. Find a similar exercise, copy its whole `{ … }` block, and paste it after that block, with a comma between them. Exercises are grouped by movement pattern, and the app lists them in file order.
3. Change the fields. Every field is explained in [`data/schema/exercises.schema.json`](data/schema/exercises.schema.json). The main ones:
   - `id`: a new short id in lowercase letters, digits and hyphens. Never change the id of an exercise that's already there, because people's workout history refers to it.
   - `name`, `pattern`, `muscles` (primary muscle first), `tracking`, and `cues` (two or three short ones).
   - `equipment`: the ways to do it. `[["dumbbell", "bench"], ["dumbbell"]]` means dumbbells and a bench, or just dumbbells. `[[]]` means no equipment. Ids come from [`data/equipment.json`](data/equipment.json).
   - Leave out the optional fields you don't need.
4. Click **Propose changes**, then **Create pull request**. A check runs automatically and points out anything that needs fixing.

Here is a complete example:

```json
{
  "id": "gobletlunge",
  "name": "Goblet reverse lunge",
  "pattern": "single",
  "muscles": ["quads", "glutes"],
  "equipment": [["dumbbell"], ["kettlebell"]],
  "tracking": "weight-reps",
  "qualities": ["single"],
  "bodyweightShare": 0.85,
  "strongRatio": 1.9,
  "cues": ["Hold the weight at your chest", "Step back, back knee to the floor", "Drive up through the front heel"]
}
```

## Add a sport or a piece of equipment

Same steps, in [`data/sports.json`](data/sports.json) or [`data/equipment.json`](data/equipment.json). A sport rates the qualities it relies on from 1 to 3. The quality ids are explained in the exercises schema.

## Data or code?

Anything you can describe with the existing fields is data. A new movement pattern, muscle group, quality or way of logging sets changes how the coach plans and scores, so it needs a code change in `index.html`. Open an issue or a pull request for that.

## Checking locally

```sh
node scripts/check-data.js     # unique ids, equipment exists
npx ajv-cli@5 validate --spec=draft2020 -s data/schema/exercises.schema.json -d data/exercises.json
python3 -m http.server         # then open http://localhost:8000
```
