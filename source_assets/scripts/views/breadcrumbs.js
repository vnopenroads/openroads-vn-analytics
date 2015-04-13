'use strict';

var BaseView = require('./base-view.js');

module.exports = BaseView.extend({

  template: require('../templates/breadcrumbs.html'),

  tagName: 'ul',
  className: 'breadcrumbs',

  initialize: function() {}
});
