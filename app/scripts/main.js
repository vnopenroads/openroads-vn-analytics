/*global OpenroadsAnalytics, $*/


window.OpenroadsAnalytics = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
      'use strict';
      console.log('Welcome to the Philippines OpenRoads project.' +
        ' Built with &hearts; by Development Seed'+
        ' https://developmentseed.org.');

      // initialize the router.
      new OpenroadsAnalytics.Routers.Dashboard();
      Backbone.history.start();
    }
};

$(document).ready(function () {
    'use strict';
    OpenroadsAnalytics.init();
});
