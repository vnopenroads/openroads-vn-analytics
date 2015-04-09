'use strict';
var fs = require('fs');
var Mustache = require('mustache');

// note: the fs.readFileSync calls have to be explicit so that brfs can
// automagically inline them into the bundled js.

var templateCache = {
  app: fs.readFileSync('./templates/app.html', 'utf-8'),
  dashboard: fs.readFileSync('./templates/dashboard.html', 'utf-8'),
  meta: fs.readFileSync('./templates/meta.html', 'utf-8'),
  projects: fs.readFileSync('./templates/projects.html', 'utf-8'),
  'road-network': fs.readFileSync('./templates/road-network.html', 'utf-8') 
};


module.exports = {
  render: function renderTemplate(templateName, model) {
    return Mustache.render(templateCache[templateName], model);
  }
};
