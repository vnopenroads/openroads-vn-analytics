'use strict';
var Backbone = require('backbone');
var _ = require('underscore');
var config = require('../config.js');

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

function findTag(key, tags) {
  for (var i = 0, ii = tags.length; i < ii; ++i) {
    if (tags[i].k === key) {
      return tags[i]
    }
  }
  return false
}

module.exports = Backbone.Model.extend({
  url: config.apiUrl + '/relations/',

  initialize: function(options) {
    this.url += options.id
  },

  parse: function(resp) {
    if (!resp.length) {
      return
    }
    resp = resp[0];
    var crumbs = makeCrumbs({
      name: (findTag('name', resp.tags).v || resp.id),
      id: resp.id
    });

    return _.extend({}, resp, {
      crumbs: crumbs,
      type: {}

    });
  }
});
