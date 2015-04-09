var fs = require('fs');

// note: the fs.readFileSync calls have to be explicit so that brfs can
// automagically inline them into the bundled js.

module.exports = {
  app: fs.readFileSync('./templates/app.html', 'utf-8'),
  dashboard: fs.readFileSync('./templates/dashboard.html', 'utf-8'),
  meta: fs.readFileSync('./templates/meta.html', 'utf-8'),
  projects: fs.readFileSync('./templates/projects.html', 'utf-8'),
  'road-network': fs.readFileSync('./templates/projects.html', 'utf-8') 
};
