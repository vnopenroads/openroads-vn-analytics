'use strict';

var Backbone = require('backbone');
var $ = require('jquery');

var AppView = require('./views/app.js');
var DashboardView = require('./views/dashboard.js');
var MetaView = require('./views/meta.js');
var ProjectsView = require('./views/projects.js');
var RoadNetworkView = require('./views/road-network.js');

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
    region.fetch();
  },
  meta: function (id) { console.log('meta UNIMPLEMENTED', id); },
  roadNetwork: function (id) { console.log('roadNetwork UNIMPLEMENTED', id); },
  projects: function (id) { console.log('projects UNIMPLEMENTED', id); },


  showView: function(view) {
    this.app.$el.find('#main').html(view.render().el);
  }
});

