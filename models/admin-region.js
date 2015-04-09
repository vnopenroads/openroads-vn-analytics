'use strict';

var Backbone = require('backbone');

module.exports = Backbone.Model.extend({

  urlRoot: 'http://localhost:4000/admin/municipality',

  initialize: function() {
  },

  defaults: {
  },

  validate: function(attrs, options) {
  },

  parse: function(response, options)  {
    return response;
  }

});

