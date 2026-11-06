// Checks what the JSON Schemas can't: ids are unique and every reference points at an entry that exists.
// Run: node scripts/check-data.js
const fs = require('fs'), path = require('path');
const load = (n) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', n + '.json'), 'utf8'));
const exercises = load('exercises'), sports = load('sports'), equipment = load('equipment'), figures = load('figures'), routines = load('routines');
const errors = [];

for (const [file, list] of [['exercises', exercises], ['sports', sports], ['equipment', equipment], ['figures', figures], ['routines', routines]]) {
  const seen = new Set();
  for (const x of list) {
    if (seen.has(x.id)) errors.push(`${file}.json: id "${x.id}" is used more than once`);
    seen.add(x.id);
  }
}
const eq = new Set(equipment.map((e) => e.id)), fig = new Set(figures.map((f) => f.id));
for (const x of exercises) {
  for (const option of x.equipment) for (const e of option) {
    if (!eq.has(e)) errors.push(`exercises.json: "${x.id}" needs equipment "${e}", which isn't in equipment.json`);
  }
  if (x.figure && !fig.has(x.figure)) errors.push(`exercises.json: "${x.id}" uses figure "${x.figure}", which isn't in figures.json`);
  if (x.strongReps && x.tracking !== 'bodyweight-reps') errors.push(`exercises.json: "${x.id}" has strongReps but isn't tracked as bodyweight-reps`);
  if (x.strongSeconds && x.tracking !== 'time') errors.push(`exercises.json: "${x.id}" has strongSeconds but isn't tracked as time`);
}
const exIds = new Map(exercises.map((x) => [x.id, x])), sportIds = new Set(sports.map((s) => s.id));
for (const r of routines) {
  for (const s of r.sports || []) if (!sportIds.has(s)) errors.push(`routines.json: "${r.id}" is for sport "${s}", which isn't in sports.json`);
  for (const st of r.steps) {
    const x = exIds.get(st.exercise);
    if (!x) { errors.push(`routines.json: "${r.id}" uses exercise "${st.exercise}", which isn't in exercises.json`); continue; }
    if (st.seconds && x.tracking !== 'time') errors.push(`routines.json: "${r.id}" gives seconds for "${st.exercise}", which is tracked as ${x.tracking}`);
    if (st.reps && x.tracking === 'time') errors.push(`routines.json: "${r.id}" gives reps for "${st.exercise}", which is tracked as time`);
  }
  if (r.rest != null && !r.rounds) errors.push(`routines.json: "${r.id}" has rest but no rounds`);
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`data ok: ${exercises.length} exercises, ${sports.length} sports, ${equipment.length} equipment, ${figures.length} figures, ${routines.length} routines`);
