'use strict';

var BaseView = require('./base-view.js');

module.exports = BaseView.extend({
  template: require('../templates/barangay.html'),

  render: function () {
    var model = this.model ? this.model.attributes : {};
console.log(model);
    try {
      this.$el.html(this.template(model));
    } catch (e) {
      console.error(e);
    }

    return this;
  }

});
