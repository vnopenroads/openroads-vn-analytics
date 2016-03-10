'use strict';
import React from 'react';
import _ from 'lodash';
import d3 from 'd3';
import Popover from '../../utils/popover';

const meta = {
  // condition
  excellent: { index: 0, fill: '#0C9ECB' },
  good: { index: 1, fill: '#3DB1D5' },
  fair: { index: 2, fill: '#91D3E7' },
  bad: { index: 3, fill: '#B6E1EF' },
  poor: { index: 4, fill: '#e0f2f8' },

  // responsibility
  barangay: { index: 0, fill: '#0C9ECB' },
  municipal: { index: 1, fill: '#3DB1D5' },
  provincial: { index: 2, fill: '#91D3E7' },
  national: { index: 3, fill: '#B6E1EF' },
  'private': { index: 4, fill: '#E0F2F8' },

  'default': { index: 99, fill: '#EEEEEE' }
};

const getMeta = (d) => meta[d.title] || meta['default'];

var PieChart = React.createClass({
  displayName: 'PieChart',

  propTypes: {
    className: React.PropTypes.string,
    popoverContentFn: React.PropTypes.func,
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
    this.chart.setPopoverContentFn(this.props.popoverContentFn);
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

  var _this = this;
  // must be added.
  var _width, _height, _radius;
  // Elements.
  var svg, dataCanvas;
  // Scales.
  var arc = d3.svg.arc();
  // Generators
  var pie;
  // Init the popover.
  var chartPopover = new Popover();

  this._calcSize = function () {
    _width = parseInt(this.$el.style('width'), 10);
    _height = parseInt(this.$el.style('height'), 10);
  };

  this.setPopoverContentFn = function (fn) {
    this.popoverContentFn = fn;
  };

  this.setData = function (data) {
    if (data === null) {
      return null;
    }

    let total = _.values(data).map(parseFloat).reduce((a, b) => a + b);
    this.data = Object.keys(data).map(d => ({title: d, val: data[d] / total}))
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

    pie = d3.layout.pie()
      .sort(null)
      .value(d => d.val);
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
      .style('fill', d => getMeta(d.data).fill)
      .on('mouseover', this._onMouseOver)
      .on('mouseout', this._onMouseOut);
  };

  this.destroy = function () {
    chartPopover.hide();
    this.$el.empty();
  };

  this._onMouseOver = function (d) {
    if (_this.popoverContentFn) {
      let bounding = this.getBoundingClientRect();

      let posX = window.pageXOffset + bounding.left;
      let posY = window.pageYOffset + bounding.top - 16;

      posX += bounding.width / 2;
      posY += bounding.height / 2;

      chartPopover.setContent(_this.popoverContentFn(d)).show(posX, posY);
    }
  };

  this._onMouseOut = function () {
    chartPopover.hide();
  };

  // ------------------------------------------------------------------------ //
  // 3... 2... 1... GO...
  this._init();
  this.setData(data);
};
