'use strict';

var Backbone = require('backbone');
var $ = require('jquery');

var BaseView = require('./views/base-view.js');
var AppView = require('./views/app.js');
var AdminListView = require('./views/admin-list.js');
var BarangayView = require('./views/barangay.js');
var MunicipalityView = require('./views/municipality.js');

var MetaView = BaseView.extend({
  template: require('./templates/meta.html')
});
var ProjectsView = BaseView.extend({
  template: require('./templates/projects.html')
});
var AdminRegion = require('./models/admin-region.js');
var CachedAdminRegion = require('./models/cached-admin-region.js');
var AdminList = require('./models/admin-list.js');
var getAdmin = require('./lib/admin-type.js');
var spinner = require('./lib/spinner.js');

var admin = require('./lib/admin-type.js');

module.exports = Backbone.Router.extend({
  routes: {
    // sub-region pages
    'analytics(/)': 'dashboard',
    'analytics/:id': 'dashboard',

    'analytics/:id/meta': 'meta',
    'analytics/:id/projects': 'projects'
  },

  initialize: function() {
    this.app = new AppView();
    this.app.render();
    $('body').append(this.app.$el);
  },

  dashboard: function (id) {
    var region;

    // If there's no id, assume it's the national view.
    if (id) {
      region = new AdminList({id: id});
    }
    else {
      region = new AdminList();
    }

    if (id && admin.get(id) === 'b') {
      this.showView(new BarangayView({
        model: new AdminRegion({id: id}),
        adminListModel: region
      }));
    }
    else if (id && admin.get(id) === 'm') {
      return this.showView(new MunicipalityView({
        model: new AdminRegion({id: id}),
        adminListModel: region
      }));
    }
    else {
      return this.showView(new AdminListView({
        model: new CachedAdminRegion(region),
        adminListModel: region
      }));
    }
  },

  meta: function (id) {
    var region = new AdminRegion({id: id});
    this.showView(new MetaView({
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
    view.model.fetch(); // TODO: only fetch if we don't have it
    this.app.$el.find('#main').html(view.render().el);
  }
});

