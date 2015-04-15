'use strict';

var BaseView = require('./base-view.js');
var dataTable = require('datatables');
var $ = require('jquery');
$.DataTable = dataTable;
var Spinner = require('../lib/spinner.js');

var AdminSearchView = require('./admin-search.js');


module.exports = BaseView.extend({

  initialize: function (options) {
    if(!options.adminListModel) {
      throw new Error('DashboardView requires an adminListModel!');
    }
    this.adminListModel = options.adminListModel;

    BaseView.prototype.initialize.call(this);
    this.listenTo(this.adminListModel, 'change', this.render);
    this.adminListModel.fetch();

    this.adminSearchView = new AdminSearchView();
  },

  render: function () {
    var model = this.model ? this.model.attributes : {};
    var adminListModel = this.adminListModel ?
      this.adminListModel.attributes : {};
    console.log('model', model);
    console.log('adminListModel', adminListModel);
    if (!model.properties || !adminListModel.crumbs ) {
      return this;
    }

    model.crumbs = adminListModel.crumbs;

    try {
      this.$el.html(this.template(model));

      this.$el.find('#admin-search').html(this.adminSearchView.render().el);
    } catch (e) {
      console.error(e);
    }

    // Spinner is set on the routes.js before rendering the view.
    Spinner.stop();

    this.$('.datatable').dataTable({ 'pageLength': 25 });
    return this;
  }

});
