'use strict';
var Backbone = require('backbone');
var _ = require('underscore');
var config = require('../config.js');

var projectTypes = {
  fmr: 'Farm to Market Roads',
  trp: 'Tourism Roads'
};

var crumbs = [{
  name: 'Projects',
  id: 'all/projects'
}];

function makeCrumbs(crumb) {
  if (!crumb)
    return crumbs
  return _.clone(crumbs).concat(toArray(crumb).map(function(crumb) {
    return {
      name: crumb.name,
      id: 'all/projects/' + crumb.id
    }
  }));
}

function toArray(val) {
  if (_.isArray(val)) {
    return val;
  }
  return [val];
}

module.exports = Backbone.Model.extend({
  url: config.apiUrl + '/relations?',
  initialize: function(options) {
    var type = options.type;
    switch (type) {
      case 'trp':
      case 'fmr':
        this.query = 'project=' + type;
        this.crumbs = makeCrumbs({ name: projectTypes[type], id: type });
      break;

      case 'project':
      case undefined:
      case null:
      default:
        this.query = 'type=project';
        this.crumbs = makeCrumbs();
        type = 'project';
      break;
    }
    this.url += this.query;
    this.type = type;
    return this;
  },

  parse: function(projects) {
    return {
      projects: projects,
      crumbs: this.crumbs,
      type: this.type
    }
  },
});
