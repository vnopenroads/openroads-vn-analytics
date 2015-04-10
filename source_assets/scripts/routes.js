'use strict';

var Backbone = require('backbone');
var $ = require('jquery');

var BaseView = require('./views/base-view.js');

var AppView = require('./views/app.js');

// Note: eventually some of these can be broken out into their own file
// (like AppView), but if there's no view logic this is simpler.
var DashboardView = BaseView.extend({ template: 'dashboard' });
var MetaView = BaseView.extend({ template: 'meta' });
var ProjectsView = BaseView.extend({ template: 'projects' });
var RoadNetworkView = BaseView.extend({ template: 'road-network' });

var AdminRegion = require('./models/admin-region.js');

module.exports = Backbone.Router.extend({
  routes: {
    'analytics/:id':  'dashboard',
    'analytics/:id/meta': 'meta',
    'analytics/:id/road-network': 'roadNetwork',
    'analytics/:id/projects': 'projects'
  },

  initialize: function() {
    this.app = new AppView({
      // options
    });
    this.app.render();
    $('body').append(this.app.$el);
  },

  dashboard: function (id) {
    var region = new AdminRegion({id: id});
    this.showView(new DashboardView({
      model: region
    }));
  },

  meta: function (id) {
    var region = new AdminRegion({id: id});
    this.showView(new MetaView({
      model: region
    }));
  },

  roadNetwork: function (id) {
    var region = new AdminRegion({id: id});
    this.showView(new RoadNetworkView({
      model: region
    }));
  },

  projects: function (id) {
    var region = new AdminRegion({id: id});
    this.showView(new ProjectsView({
      model: region
    }));
  },


  showView: function(view) {
    this.app.$el.find('#main').html(view.render().el);
    view.model.fetch();
  }
});

