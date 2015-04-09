/*global OpenroadsAnalytics, Backbone*/

OpenroadsAnalytics.Routers = OpenroadsAnalytics.Routers || {};

(function () {
    'use strict';

    OpenroadsAnalytics.Routers.Dashboard = Backbone.Router.extend({
      routes: {
        'analytics/:id':  'dashboard',
        'analytics/:id/meta': 'meta',
        'analytics/:id/road-network': 'roadNetwork',
        'analytics/:id/projects': 'projects'
      },

      dashboard: function (id) { console.log('dashboard UNIMPLEMENTED', id); },
      meta: function (id) { console.log('meta UNIMPLEMENTED', id); },
      roadNetwork: function (id) { console.log('roadNetwork UNIMPLEMENTED', id); },
      projects: function (id) { console.log('projects UNIMPLEMENTED', id); }

    });

})();
