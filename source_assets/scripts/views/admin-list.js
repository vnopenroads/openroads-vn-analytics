'use strict';

var BaseView = require('./base-view.js');
var dataTable = require('datatables');
var $ = require('jquery');
$.DataTable = dataTable;

module.exports = BaseView.extend({
  template: require('../templates/admin-list.html'),

  render: function () {
    var model = this.model ? this.model.attributes : {};
    if (!model.type) {
      return this
    }

    try {
      this.$el.html(this.template(model));
    } catch (e) {
      console.error(e);
    }

    this.$('.table').dataTable();
    return this;
  }

});
