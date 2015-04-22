'use strict';

var View = require('backbone').View;
var dataTable = require('datatables');
var $ = require('jquery');
$.DataTable = dataTable;

module.exports = View.extend({
  template: require('../templates/projects.html'),

  // For single projects.
  projectTemplate: require('../templates/project.html'),

  events: {
    'click .link-row td': 'navigateToProject',
  },

  initialize: function() {
    this.render();
  },

  navigateToProject: function(e) {
    var target = $(e.currentTarget).parent('tr');
    if (target.length) {
      window.router.navigate('#/all/projects/' + target.data('id'));
    }
  },

  render: function() {
    var collection = this.collection;
    var template = collection.length > 1 ? this.template : this.projectTemplate;
    this.$el.html(template({ projects: collection.models }));
    this.$('.datatable').dataTable({ 'pageLength': 25 });
    return this;
  }
});
