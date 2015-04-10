'use strict';

var BaseView = require('./base-view.js');

module.exports = BaseView.extend({

  template: require('../templates/app.html'),

  tagName: 'div',
  id: 'analytics',
  className: 'openroads',
  events: {},

  initialize: function () {
  },

});

