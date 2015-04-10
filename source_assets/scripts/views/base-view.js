'use strict';

var Backbone = require('backbone');
var templates = require('../templates.js');

/*
 *
 * Extend this class (`BaseView.extend({...})`) and provide a
 * `template` property that names the template for your view.
 * 
 * There's a map of template names to files in ../templates.js
 *
 */
module.exports = Backbone.View.extend({

  tagName: 'div',

  initialize: function () {
    if(this.model)
      this.listenTo(this.model, 'change', this.render);
  },

  render: function () {
    var model = this.model ? this.model.attributes : {};
    console.log('render', model);
    this.$el.html(templates.render(this.template, model));
    return this;
  }

});

