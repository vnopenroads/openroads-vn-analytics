'use strict';
var _ = require('underscore');
var View = require('backbone').View;
var dataTable = require('datatables');
var $ = require('jquery');
$.DataTable = dataTable;

var stats = require('../lib/stats.js');

module.exports = View.extend({
  template: require('../templates/area.html'),
  initialize: function() {
    this.render();
  },
  render: function() {
    var model = this.model;

    // top-line stats
    var id = model.get('id');
    model.set('name', id.getDisplayName(model.get('properties')));
    model.set('overview', stats.displayStats(model.get('stats')));
    model.set('subtype', id.display[id.childType()]);

    // stats for each subregion
    _.each(model.attributes.subregions, function(region) {
      region.overview = stats.displayStats(region.stats);
    });

    this.$el.html(this.template(model.attributes));
    this.$('.datatable').dataTable({ 'pageLength': 25 });
  },
});
