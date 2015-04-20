'use strict';

var Backbone = require('backbone');
var $ = require('jquery');

// MODELS
var Area = require('./models/area.js');
var CachedArea = require('./models/cached-area.js');
var Project = require('./models/project.js');
var Projects = require('./models/projects.js');

// VIEWS
var SidebarView = require('./views/sidebar.js');
var AreaView = require('./views/area.js');
var Barangay = require('./views/barangay.js');
var ProjectView = require('./views/project.js');
var ProjectsView = require('./views/projects.js');

// HELPERS
var ID = require('./lib/id.js');
var spin = require('./lib/spinner.js');

module.exports = Backbone.Router.extend({

  routes: {
    '':                       'area',
    ':id':                    'area',

    'all/projects(/)':        'projects',
    'all/projects/:type':     'project',

    '*path': 'defaultRoute'
  },

  initialize: function() {
    this.sidebar = new SidebarView({el: $('#sidebar')});
  },

  area: function(id) {
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
    this.sidebar.setModel(model);
    model.fetch({
      success: function areaLoaded() {
        view = new view({ model: model, el: $('#content') });
        spin.stop();
      }
    });
  },

  projects: function (type) {
    type = type ? type.toLowerCase() : type;
    var projects = new Projects({type: type});
    /*
    this.showView(new ProjectsView({
      model: projects
    }));
    */
  },

  project: function (id) {
    var project = new Project({id: id});
    /*
    this.showView(new ProjectView({
      model: project
    }));
    */
  },

  defaultRoute: function () {
    this.navigate('/#', {trigger: true});
  },
});
