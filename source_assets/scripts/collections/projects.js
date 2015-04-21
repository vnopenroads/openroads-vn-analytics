'use strict';
var Collection = require('backbone').Collection;
var _ = require('underscore');
var model = require('../models/project.js');
var config = require('../config.js');
var projectTags = require('../lib/project-tags.js');

function tag(key, tags) {
  for (var i = 0, ii = tags.length; i < ii; ++i) {
    if (tags[i].k === key) {
      return tags[i];
    }
  }
  return false;
}

module.exports = Collection.extend({

    url: config.apiUrl + '/relations',
    model: model,

    initialize: function(options) {
      var query;
      var project = options.project;
      if (project === 'all') {
        query = '?type=project';
      }
      else {
        query = '/' + project;
      }
      this.url += query;
      this.project = project;
    },
});
