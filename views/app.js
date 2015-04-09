'use strict';

var BaseView = require('./base-view.js');

module.exports = BaseView.extend({

  template: 'app',

  tagName: 'div',
  id: 'analytics',
  className: 'openroads',
  events: {},

  initialize: function () {
  },

});

