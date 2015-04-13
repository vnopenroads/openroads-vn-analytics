'use strict';

var BaseView = require('./base-view.js');
var dataTable = require('datatables');
var $ = require('jquery');
$.DataTable = dataTable;

module.exports = BaseView.extend({
  template: require('../templates/road-network.html'),
  render: function () {
    BaseView.prototype.render.call(this);
    $('.table').dataTable();
    return this;
  }
});