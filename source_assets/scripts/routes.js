'use strict';

var Backbone = require('backbone');
var $ = require('jquery');

// MODELS
var Area = require('./models/area.js');
var CachedArea = require('./models/cached-area.js');

// VIEWS
var SidebarView = require('./views/sidebar.js');
var AreaView = require('./views/area.js');
var Barangay = require('./views/barangay.js');

// HELPERS
var ID = require('./lib/id.js');

var Spinner = require('./lib/spinner.js');

var BaseView = require('./views/base-view.js');
var ProjectsView = require('./views/projects.js');
var ProjectView = require('./views/project.js');

var MetaView = BaseView.extend({
  template: require('./templates/meta.html')
});
var AdminRegion = require('./models/admin-region.js');
var Projects = require('./models/projects.js');
var Project = require('./models/project.js');


module.exports = Backbone.Router.extend({

  routes: {
    '':                       'area',
    ':id':                    'area',
    ':id/meta':               'meta',
    'all/projects(/)':        'projects',
    'all/projects/:type':     'project',
    '*path': 'defaultRoute'
  },

  initialize: function() {
    this.sidebar = new SidebarView({el: $('#sidebar')});
  },

  area: function(id) {
    id = new ID(id);
    switch (id.type()) {
      case 'n':
      case 'r':
      case 'p':
        this.cachedRegion(id);
      break;

      case 'm':
        this.municipality(id);
      break;

      case 'b':
        this.barangay(id);
      break;
    }
  },

  cachedRegion: function(id, callback) {
    var area = new CachedArea({ id: id });
    area.fetch({success: function areaSuccess() {
      var areaView = new AreaView({ model: area, el: $('#content') });
    }});
  },

  municipality: function(id, callback) {
    var area = new Area({ id: id });
    area.fetch({success: function areaSuccess() {
      var areaView = new AreaView({ model: area, el: $('#content') });
    }});
  },

  barangay: function(id, callback) {
    console.log('in barangay');
    var area = new Area({ id: id });
    area.fetch({success: function areaSuccess() {
      var areaView = new Barangay({ model: area, el: $('#content') });
    }});
  },




  meta: function (id) {
    var region = new AdminRegion({id: id});
    this.showView(new MetaView({
      model: region
    }));
  },

  projects: function (type) {
    type = type ? type.toLowerCase() : type;
    var projects = new Projects({type: type});
    this.showView(new ProjectsView({
      model: projects
    }));
  },

  project: function (id) {
    var project = new Project({id: id});
    this.showView(new ProjectView({
      model: project
    }));
  },

  defaultRoute: function () {
    this.navigate('', {trigger: true});
  },

  showView: function(view) {
    Spinner.set('spin');
    view.model.fetch(); // TODO: only fetch if we don't have it
    $('#main').html(view.render().el);
  }
});
