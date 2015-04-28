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
    var mapped = +_.result(_.find(model.get('overview'), { display: 'Total' }), 'length') || 0;
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

    var margin = [0, 5, 40, 5];
    var width = $container.width() - margin[1] - margin[3];
    var height = 70 - margin[0] - margin[2];

    var svg = d3.select(id).append('svg')
      .attr('width', width + margin[0] + margin[3])
      .attr('height', height + margin[0] + margin[2]);

    var g = svg.append('g')
      .attr('transform', 'translate(' + margin[3] + ',' + margin[0] + ')');

    var progress = (mapped / total) * width;

    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'progress-fill');

    var start = g.append('text')
      .attr('x', 0)
      .attr('y', height)
      .attr('dy', 16)
      .text(0)
      .attr('class', 'progress-marker');

    g.append('text')
      .attr('x', width)
      .attr('y', height)
      .attr('dy', 16)
      .text(util.delimit(total) + ' km')
      .attr('class', 'progress-marker')
      .attr('text-anchor', 'end');

    var rect = g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', height)
      .attr('class', 'progress-indicator');

    var delay = 600;

    rect.transition()
      .delay(delay)
      .duration(400)
      .attr('width', progress);

    start.transition()
      .delay(delay)
      .duration(400)
      .tween('text', function() {
        var i = d3.interpolate(this.textContent, mapped);
        return function(t) {
          this.textContent = util.delimit(Math.round(i(t))) + ' km mapped';
        };
      });
  },
});
