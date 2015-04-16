var fs = require('fs');
var _ = require('underscore');

var path = '../source_assets/static/by_condition';
files = _.filter(fs.readdirSync(path), function(filename) {
  return filename.slice(-4) === 'json'
});
console.log(files);

function recurse(index, length, data) {
  if (index === length-1) write(data);
  else {
    var filename = files[index];
    var filepath = path + '/' + filename;
    var json = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    var key = filename.slice(0, filename.length-5);
    data[key] = json;
    console.log('writing', key);
    recurse(++index, length, data);
  }
}

recurse(0, files.length, {});

function write(result) {
  fs.writeFile('../source_assets/static/combined.js', JSON.stringify(result));
}
