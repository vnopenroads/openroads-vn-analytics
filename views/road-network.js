'use strict';

var Backbone = require('backbone');
var templates = require('../templates.js');

module.exports = Backbone.View.extend({

  template: templates['road-network'],

  tagName: 'div',

  id: '',

  className: '',

  events: {},

  initialize: function () {
      this.listenTo(this.model, 'change', this.render);
  },

  render: function () {
      this.$el.html(this.template(this.model.toJSON()));
  }

});

