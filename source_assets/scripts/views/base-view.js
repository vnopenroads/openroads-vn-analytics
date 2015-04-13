'use strict';

var Backbone = require('backbone');

/*
 *
 * Extend this class (`BaseView.extend({...})`) and provide a
 * `template` property that names the template for your view.
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
    try {
      this.$el.html(this.template(model));
    } catch (e) {
      console.error(e);
    }
    return this;
  }

});

