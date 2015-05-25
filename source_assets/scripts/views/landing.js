'use strict';
var View = require('backbone').View;

module.exports = View.extend({
  template: require('../templates/landing.html'),
  initialize: function() {
    this.render();
  },
  render: function() {
    var model = this.model;

    this.$el.html(this.template());
  },
});
