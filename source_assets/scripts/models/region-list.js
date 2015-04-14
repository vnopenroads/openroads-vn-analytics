'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var admin = require('../lib/admin-type.js');
var spinner = require('../lib/spinner.js');
var config = require('../config.js');
var urlBase = config.apiUrl;

// In this model we don't do any analysis,
// so simplilfy it's creation.

module.exports = Backbone.Model.extend({

  urlRoot: urlBase + '/admin',

  initialize: function() {
    spinner.spin();
  },

  parse: function(response) {
    var regions = _.map(response.subregions.features, function(feature) {
      feature = feature.properties;
      var name = feature.ADM1 || feature.ADM1_1;
      var id = feature.ID_1_OR;
      return {
        name: name,
        id: id
      }
    });

    spinner.stop();

    return {
      // Only return regions that do not break, so this looks a bit more polished.
      subregions: _.filter(regions, function(region) { return region.name }),
      type: admin.getFull(regions[0].id)
    }
  },

});


