'use strict';
var Backbone = require('backbone');
var _ = require('underscore');
var config = require('../config.js');

var projectTypes = {
  fmr: 'Farm to Market Roads',
  trp: 'Tourism Roads'
};

var columnData = {
  name: {
    display: 'Project Name',
    tag: 'name'
  },
  id: {
    display: 'ID',
    tag: 'openroads:project:id'
  },
  type: {
    display: 'Type',
    tag: 'project'
  },
  cost: {
    display: 'Cost',
    tag: 'openroads:project:cost'
  },
  tour: {
    display: 'Tourism',
    tag: 'openroads:project:tour-spot'
  },
  work: {
    display: 'Work',
    tag: 'openroads:project:work-scope'
  }
};

var columnOrder = {
  project: ['name', 'id', 'type'],
  fmr: ['name', 'id', 'type', 'cost'],
  trp: ['name', 'id', 'type', 'tour', 'work']
}

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
  url: config.apiUrl + '/relations?',
  initialize: function(options) {
    var type = options.type;
    switch (type) {

      // FMR and TRP roads will be the second tier.
      case 'trp':
      case 'fmr':
        this.query = 'project=' + type;
        this.crumbs = makeCrumbs({ name: projectTypes[type], id: type });
      break;

      // In the case of project and everything else,
      // go to projects and set type to projects.
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

    var columns = columnOrder[this.type] || columnOrder['project'];

    _.each(projects, function(project) {
      var tags = project.tags;
      project.rows = _.map(columns, function(column) {
        column = columnData[column];
        return (findTag(column.tag, tags).v || 'n/a')
      });
    });

    return {
      projects: projects,
      columns: _.map(columns, function(column) {
        return columnData[column].display
      }),
      crumbs: this.crumbs,
      type: this.type
    }
  },
});
