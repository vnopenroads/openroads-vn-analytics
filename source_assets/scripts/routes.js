'use strict';

var Backbone = require('backbone');
var $ = require('jquery');

// MODELS & COLLECTIONS
var Area = require('./models/area.js');
var CachedArea = require('./models/cached-area.js');
var Projects = require('./collections/projects.js');

// VIEWS
var SidebarView = require('./views/sidebar.js');
var AreaView = require('./views/area.js');
var Barangay = require('./views/barangay.js');
var ProjectsView = require('./views/projects.js');
var SearchView = require('./views/search.js');

// HELPERS
var ID = require('./lib/id.js');
var spin = require('./lib/spinner.js');

module.exports = Backbone.Router.extend({

  routes: {
    '':                       'area',
    ':id':                    'area',

    'all/projects(/)':        'projects',
    'all/projects/:id':       'projects',

    '*path': 'defaultRoute'
  },

  initialize: function() {
    this.sidebar = new SidebarView({el: $('#sidebar')});
    this.sidebarSearch = new SearchView({ el: $('#admin-search') });
  },

  area: function(id) {
    this.sidebar.renderHistory();
    id = new ID(id);
    var view, model;
    switch (id.type()) {
      case 'n':
      case 'r':
      case 'p':
        model = new CachedArea({ id: id });
        view = AreaView;
      break;

      case 'm':
        model = new Area({ id: id });
        view = AreaView;
      break;

      case 'b':
        model = new Area({ id: id });
        view = Barangay;
      break;
    }

    spin.set('spin');
    this.sidebar.setModel(model).select('road-network');
    model.fetch({
      success: function areaLoaded() {
        view = new view({ model: model, el: $('#content') });
        spin.stop();
      }
    });
  },

  projects: function (project) {
    // If there's no project, then search all projects.
    project = project ? project.toLowerCase() : 'all';
    spin.set('spin');
    this.sidebar.renderHistory([{ type: 'Projects', id: 'all/projects' }]).select('projects');
    var projects = new Projects({ project: project });
    projects.fetch({
      success: function projectsLoaded() {
        var view = new ProjectsView({ collection: projects, el: $('#content') });
        spin.stop();
      }
    });
  },

  defaultRoute: function () {
    this.navigate('/#', {trigger: true});
  },
});
