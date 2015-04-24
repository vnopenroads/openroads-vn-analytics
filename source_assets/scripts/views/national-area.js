'use strict';

var $ = require('jquery');
var d3 = require('d3');
var _ = require('underscore');
var Area = require('./area.js');
var template = require('../templates/national-area.html');
var util = require('../lib/helpers.js');
var stats = require('../lib/stats.js');

// TODO this is hard-coded; should be dynamic.
var total = 217456;

module.exports = Area.extend({
  template: template,

  render: function() {
    var model = this.model;
    model.set('overview', stats.displayStats(model.get('stats')));

    // Calculate the percentage of roads mapped.
    var mapped = _.result(_.find(model.get('overview'), { display: 'Total' }), 'length') || 0;
    var pct = util.round(mapped / total * 100, 2);
    model.set({
      total: util.delimit(total),
      mapped: util.delimit(util.round(mapped)),
      pct: pct
    });

    // Render the base.
    Area.prototype.render.call(this);

    // Render the progress chart.
    var id = '#road-progress';
    var $container = $(id);

    var margin = [0, 20, 40, 20];
    var width = $container.width() - margin[1] - margin[3];
    var height = 100 - margin[0] - margin[2];

    var svg = d3.select(id).append('svg')
      .attr('width', width)
      .attr('height', height);

    var progress = (mapped / total) * width;

    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', 14)
      .attr('class', 'progress-fill');

    svg.append('text')
      .attr('x', 0)
      .attr('y', 30)
      .text('0 km')
      .attr('class', 'progress-marker');

    svg.append('text')
      .attr('x', width)
      .attr('y', 30)
      .text(util.delimit(total) + ' km')
      .attr('class', 'progress-marker')
      .attr('text-anchor', 'end');

    var rect = svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', 14)
      .attr('class', 'progress-indicator');

    rect.transition()
      .delay(1000)
      .attr('width', progress);
  },
});
