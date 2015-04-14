'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var admin = require('../lib/admin-type.js');
var config = require('../config.js');
var urlBase = config.apiUrl;

// In this model we don't do any analysis,
// so simplilfy it's creation.

var map = {
  r: {
    id: 'ID_1_OR',
    name: 'ADM1',
    crumbs: ['country']
  },
  p: {
    id: 'ID_2_OR',
    name: 'ADM2',
    crumbs: ['country', 'ADM1', 'ADM2']
  },
  m: {
    id: 'ID_3_OR',
    name: 'NAME_3',
    crumbs: ['NAME_0', 'NAME_2', 'NAME_3']
  },
  b: {
    id: 'ID_4_OR',
    name: 'NAME_4',
    crumbs: ['NAME_0', 'NAME_2', 'NAME_3', 'NAME_4']
  },
};

module.exports = Backbone.Model.extend({

  urlRoot: urlBase + '/admin',

  parse: function(response) {
    console.log(response);

    // Hack to figure out whether this is a region, province, etc.
    var test = response.subregions.features[0].properties;
    var id = test.ID_4_OR || test.ID_3_OR || test.ID_2_OR || test.ID_1_OR;
    if (!id) {
      throw new Error('Not a valid response');
    }

    // Once it's all figured out, use the keys object map
    // to get the right object property names for the data.
    var type = admin.get(id);
    var keys = map[type];

    // Use the first subregion to create the trail of breadcrumbs
    // TODO again: this is a little hacky but it works if we trust our data.
    var crumbs = keys.crumbs.map(function(crumb) {
        return test[crumb]
    });

    var regions = _.map(response.subregions.features, function(feature) {
      feature = feature.properties;
      var name;

      // Regions can have either ADM1 or ADM1_1.
      if (type === 'r') {
        name = feature.ADM1 || feature.ADM1_1;
      }
      else {
        name = feature[keys.name];
      }

      return {
        name: name,
        id: id = feature[keys.id]
      }
    });

    return {
      // Only return regions that do not break, so this looks a bit more polished.
      subregions: _.filter(regions, function(region) { return region.name }),
      type: admin.full[type],
      crumbs: crumbs
    }
  },

});


