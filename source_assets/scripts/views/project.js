'use strict';

var BaseView = require('./base-view.js');
var dataTable = require('datatables');
var $ = require('jquery');
$.DataTable = dataTable;

module.exports = BaseView.extend({
  template: require('../templates/project.html'),
});
