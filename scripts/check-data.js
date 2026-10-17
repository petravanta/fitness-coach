// Checks what the JSON Schemas can't: ids are unique and every reference points at an entry that exists.
// Run: node scripts/check-data.js
const fs = require('fs'), path = require('path');
const load = (n) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', n + '.json'), 'utf8'));
const exercises = load('exercises'), sports = load('sports'), equipment = load('equipment');
const errors = [];

for (const [file, list] of [['exercises', exercises], ['sports', sports], ['equipment', equipment]]) {
  const seen = new Set();
  for (const x of list) {
    if (seen.has(x.id)) errors.push(`${file}.json: id "${x.id}" is used more than once`);
    seen.add(x.id);
  }
}
const eq = new Set(equipment.map((e) => e.id));
for (const x of exercises) {
  for (const option of x.equipment) for (const e of option) {
    if (!eq.has(e)) errors.push(`exercises.json: "${x.id}" needs equipment "${e}", which isn't in equipment.json`);
  }
  if (x.strongReps && x.tracking !== 'bodyweight-reps') errors.push(`exercises.json: "${x.id}" has strongReps but isn't tracked as bodyweight-reps`);
  if (x.strongSeconds && x.tracking !== 'time') errors.push(`exercises.json: "${x.id}" has strongSeconds but isn't tracked as time`);
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`data ok: ${exercises.length} exercises, ${sports.length} sports, ${equipment.length} equipment`);
