'use strict';

var BaseView = require('./base-view.js');
var dataTable = require('datatables');
var $ = require('jquery');
$.DataTable = dataTable;
var Spinner = require('../lib/spinner.js');

module.exports = BaseView.extend({
  template: require('../templates/projects.html'),
  events: {
    'click .link-row td': 'navigateToProject',
  },

  findProject: function(id) {
    var projects = this.model.get('projects');
    for (var i = 0, ii = projects.length; i < ii; ++i) {
      if (projects[i].id === id) {
        return id;
      }
    }
    return false;
  },

  navigateToProject: function(e) {
    var target = $(e.currentTarget).parent('tr');
    if (target.length) {
      window.router.navigate('#/analytics/all/projects/' + target.data('id'));
    }
  },

  render: function() {
    var model = this.model ? this.model.attributes : {};
    if (!model.type) {
      return this;
    }
    console.log(model);
    try {
      this.$el.html(this.template(model));
    } catch (e) {
      console.error(e);
    }

    // Spinner is set on the routes.js before rendering the view.
    Spinner.stop();

    this.$('.table').dataTable({ 'pageLength': 25 });
    return this;
  }

});
