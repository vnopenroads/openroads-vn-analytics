'use strict';
var _ = require('underscore');
var View = require('backbone').View;
var dataTable = require('datatables');
var $ = require('jquery');
$.DataTable = dataTable;

var stats = require('../lib/stats.js');
var config = require('../config.js');
var round = require('../lib/helpers.js').round;

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

    // create a link to the editor
    var centroid = model.get('centroid');
    if (centroid && centroid.geometry.coordinates) {
      centroid = centroid.geometry.coordinates;
      model.set('editor', config.editor + round(centroid[0], 4) + '/' + round(centroid[1], 4));
    }
    // template throws an error if editor isn't defined, even if conditional checks for editor.
    // thus we need to set editor to something falsy.
    else {
      model.set('editor', 0);
    }

    this.$el.html(this.template(model.attributes));
    this.$('.datatable').dataTable({ 'pageLength': 25 });
  },
});
