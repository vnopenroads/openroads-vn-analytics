'use strict';

var Backbone = require('backbone');
var $ = require('jquery');

// MODELS & COLLECTIONS
var Area = require('./models/area.js');
var CachedArea = require('./models/cached-area.js');
var Projects = require('./collections/projects.js');

// VIEWS
var SidebarView = require('./views/sidebar.js');
var LandingView = require('./views/landing.js');
var NationalAreaView = require('./views/national-area.js');
var AreaView = require('./views/area.js');
var Barangay = require('./views/barangay.js');
var ProjectsView = require('./views/projects.js');
var SearchView = require('./views/search.js');

// HELPERS
var ID = require('./lib/id.js');
var spin = require('./lib/spinner.js');

module.exports = Backbone.Router.extend({

  routes: {
    '':                       'landing',
    'phi':                    'national',
    ':id':                    'area',

    'all/projects(/)':        'projects',
    'all/projects/:id':       'projects',

    '*path': 'defaultRoute'
  },

  initialize: function() {
    this.sidebar = new SidebarView({el: $('#sidebar')});
    this.sidebarSearch = new SearchView({ el: $('#admin-search') });
  },

  landing: function() {
    new LandingView({ el: $('#content') });
  },

  national: function() {

    var id = new ID(null);
    var area = new CachedArea({ id: id });

    spin.set('spin');
    this.sidebar.setModel(area).select('road-network');
    area.fetch({
      success: function nationalLoaded() {
        new NationalAreaView({ model: area, el: $('#content') });
        spin.stop();
      }
    });
  },

  area: function(id) {
    id = new ID(id);
    var View, model;
    switch (id.type()) {
      case 'r':
      case 'p':
        model = new CachedArea({ id: id });
        View = AreaView;
      break;

      case 'm':
        model = new Area({ id: id });
        View = AreaView;
      break;

      case 'b':
        model = new Area({ id: id });
        View = Barangay;
      break;
    }

    spin.set('spin');
    this.sidebar.setModel(model).select('road-network');
    model.fetch({
      success: function areaLoaded() {
        new View({ model: model, el: $('#content') });
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
        new ProjectsView({ collection: projects, el: $('#content') });
        spin.stop();
      }
    });
  },

  defaultRoute: function () {
    this.navigate('/#', {trigger: true});
  },
});
