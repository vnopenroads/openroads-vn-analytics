'use strict';
import React from 'react';
import _ from 'lodash';
import d3 from 'd3';
// will be useful once we show tooltips
// import titlecase from 'titlecase';

const meta = {
  // condition
  excellent: { index: 0, fill: '#ffffd4' },
  good: { index: 1, fill: '#fed98e' },
  fair: { index: 2, fill: '#fe9929' },
  bad: { index: 3, fill: '#d95f0e' },
  poor: { index: 4, fill: '#993404' },

  // responsibility
  barangay: { index: 0, fill: '#8dd3c7' },
  municipal: { index: 1, fill: '#ffffb3' },
  provincial: { index: 2, fill: '#bebada' },
  national: { index: 3, fill: '#fb8072' },
  'private': { index: 4, fill: '#80b1d3' },

  'default': { index: 99, fill: '#EEEEEE' }
};

const getMeta = (d) => meta[d.title] || meta['default'];

var PieChart = React.createClass({
  displayName: 'PieChart',

  propTypes: {
    className: React.PropTypes.string,
    data: React.PropTypes.object
  },

  chart: null,

  onWindowResize: function () {
    this.chart.update();
  },

  componentDidMount: function () {
    // console.log('PieChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new Chart(this.refs.container, null);
  },

  componentWillUnmount: function () {
    // console.log('PieChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function () {
    // console.log('PieChart componentDidUpdate');
    this.chart.setData(this.props.data);
  },

  render: function () {
    return (
      <div className={this.props.className} ref='container'></div>
    );
  }
});

module.exports = PieChart;

var Chart = function (el, data) {
  this.$el = d3.select(el);

  this.data = null;
  this.stages = null;

  // must be added.
  var _width, _height, _radius;
  // Elements.
  var svg, dataCanvas;
  // Scales.
  var arc = d3.svg.arc();
  // Generators
  var pie;
  pie = d3.layout.pie()
    .sort(null)
    .value(d => d.val);

  this._calcSize = function () {
    _width = parseInt(this.$el.style('width'), 10);
    _height = parseInt(this.$el.style('height'), 10);
  };

  this.setData = function (data) {
    if (data === null) {
      return null;
    }
    this.data = Object.keys(data).map(d => ({title: d, val: data[d]}))
      .sort((a, b) => getMeta(a).index > getMeta(b).index ? 1 : -1);
    this.update();
  };

  this._init = function () {
    this._calcSize();
    // The svg.
    svg = this.$el.append('svg')
        .attr('class', 'chart');

    // Chart elements
    dataCanvas = svg.append('g')
      .attr('class', 'data-canvas');
  };

  this.update = function () {
    this._calcSize();

    svg
      .attr('width', _width)
      .attr('height', _height);

    dataCanvas
      .attr('transform', 'translate(' + _width / 2 + ',' + _height / 2 + ')');

    _radius = Math.min(_width, _height) / 2;

    arc
      .outerRadius(_radius - 10)
      .innerRadius(0);

    let selection = dataCanvas.selectAll('.arc')
      .data(pie(this.data));

    selection.enter().append('g')
      .attr('class', 'piechart-arc')
    .append('path')
      .attr('d', arc)
      .style('fill', d => getMeta(d.data).fill);
  };

  this.destroy = function () {
    this.$el.empty();
  };

  // ------------------------------------------------------------------------ //
  // 3... 2... 1... GO...
  this._init();
  this.setData(data);
};
