'use strict';

var Backbone = require('backbone');
var templates = require('../templates.js');

module.exports = Backbone.View.extend({

  template: templates.app,

  tagName: 'div',

  id: '',

  className: '',

  events: {},

  initialize: function () {
  },

  render: function () {
    this.$el.html(this.template);
  }

});

