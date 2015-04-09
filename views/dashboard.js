'use strict';

var Backbone = require('backbone');
var templates = require('../templates.js');

module.exports = Backbone.View.extend({

  template: templates.dashboard,

  tagName: 'div',

  id: '',

  className: '',

  events: {},

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function () {
    console.log('render', JSON.stringify(this.model.attributes));
    this.$el.html(this.template);
    return this;
  }

});

