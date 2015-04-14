'use strict';
var Backbone = require('backbone');
var _ = require('underscore');
var config = require('../config.js');

module.exports = Backbone.Model.extend({
  url: config.apiUrl + '/relations',
  parse: function(resp) {
    console.log(resp);
    return resp
  }
});
