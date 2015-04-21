'use strict';
var Model = require('backbone').Model;
var _ = require('underscore');
var projectTags = require('../lib/project-tags.js');

module.exports = Model.extend({
  defaults: {
    id: ''
  },

  tableRows: function() {
    var tags = this.get('tags');
    return _.map(['name', 'id', 'type'], function(t) {
      return _.result(_.find(tags, { k: projectTags[t].tag }), 'v') || 'n/a';
    });
  },

  headers: function() {
    return _.map(['name', 'id', 'type'], function(t) {
      return projectTags[t].display;
    });
  },

  tags: function() {
    var tags = [];
    _.each(this.get('tags'), function(t) {
      var tag = _.result(_.find(projectTags, { tag: t.k }), 'display');
      if (tag) tags.push({ prop: tag, val: t.v });
    });
    return tags;
  },

});
