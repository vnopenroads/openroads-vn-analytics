// used to regenerate the section-fields file
// run it in the iD/data/presets/fields/ folder and replace the JSON
// in sections-fields.js with the output JSON if the fields in iD change

const fs = require('fs');

let files = fs.readdirSync('.');

files = files.filter(f => f.startsWith('or_'));

const data = files.map(f => {
  return JSON.parse(fs.readFileSync(f));
}).reduce((acc, val) => {
  acc[val.key] = {
    label: val.label
  };
  if (val.strings) {
    acc[val.key]['strings'] = val.strings;
  }
  return acc;
}, {});
