'use strict';

var Backbone = require('backbone');

var admin = require('../lib/admin-type.js');
var config = require('../config.js');
var urlBase = config.apiUrl;

// In this model we don't do any analysis,
// so simplify it's creation.

// var accessors = {
//   r: {
//     id: 'ID_1_OR',
//     name: 'ADM1',
//     crumbs: []
//   },
//   p: {
//     id: 'ID_2_OR',
//     name: 'ADM2',
//     crumbs: ['ADM1']
//   },
//   m: {
//     id: 'ID_3_OR',
//     name: 'NAME_3',
//     crumbs: ['ADM1', 'NAME_2']
//   },
//   b: {
//     id: 'ID_4_OR',
//     name: 'NAME_4',
//     crumbs: ['ADM1', 'NAME_2', 'NAME_3']
//   },
// };

//  var adminNames = ['Region', 'Province', 'Municipality', 'Barangay'];
var adminAbbrev = ['r', 'p', 'm', 'b'];

module.exports = Backbone.Model.extend({

  urlRoot: urlBase + '/subregions',

  parse: function(response) {
    console.log(response);

    if (!response.meta) {
      response.meta = {type: 0, id: null};
    }

    var crumbs = [];
    switch(response.meta.type) {
      case 4:
        crumbs.push({name: response.meta.NAME_4, id: response.meta.ID_4_OR});
        /* falls through */
      case 3:
        crumbs.push({name: response.meta.NAME_3, id: response.meta.ID_3_OR});
        /* falls through */
      case 2:
        crumbs.push({name: response.meta.NAME_2, id: response.meta.ID_2_OR});
        /* falls through */
      case 1:
        crumbs.push({name: response.meta.NAME_1, id: response.meta.ID_1_OR});
      break;
    }
    crumbs = crumbs.reverse();

    return {
      id: response.meta.id,
      subregions: response.adminAreas,
      // This is not the type of what we're seeing but the type of the
      // subregions instead.
      type: admin.full[adminAbbrev[response.meta.type]],
      crumbs: crumbs
    };
  },

});


