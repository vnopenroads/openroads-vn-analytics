'use strict';
var Collection = require('backbone').Collection;
var model = require('../models/project.js');
var config = require('../config.js');

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
