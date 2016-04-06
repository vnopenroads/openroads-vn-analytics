'use strict';
import React from 'react';
import _ from 'lodash';
import d3 from 'd3';
import titlecase from 'titlecase';
import Popover from '../../utils/popover';
import { formatThousands } from '../../utils/format';

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
    if (this.chart) {
      this.chart.update();
    }
  },

  componentDidMount: function () {
    // console.log('PieChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new Chart(this.refs.container, this.props.data);
    this.chart.setPopoverContentFn(this.props.popoverContentFn);
  },

  componentWillUnmount: function () {
    // console.log('PieChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    if (this.chart) {
      this.chart.destroy();
    }
  },

  componentDidUpdate: function () {
    // console.log('PieChart componentDidUpdate');
    if (this.chart) {
      this.chart.setPopoverContentFn(this.props.popoverContentFn);
      this.chart.setData(this.props.data);
    }
  },

  render: function () {
    return (
      <div className={this.props.className} ref='container'>
        <div className='chart-wrapper'></div>
        <div className='legend-wrapper'></div>
      </div>
    );
  }
});

module.exports = PieChart;

var Chart = function (el, data) {
  this.$elChart = d3.select(el).select('.chart-wrapper');
  this.$elLegend = d3.select(el).select('.legend-wrapper');

  this.data = null;
  this.stages = null;

  var _this = this;
  // must be added.
  var _width, _height, _radius;
  // Elements.
  var svg, dataCanvas, legend;
  // Scales.
  var arc = d3.svg.arc();
  // Generators
  var pie;
  // Init the popover.
  var chartPopover = new Popover();

  this._calcSize = function () {
    _width = parseInt(this.$elChart.style('width'), 10);
    _height = parseInt(this.$elChart.style('height'), 10);
  };

  this.setPopoverContentFn = function (fn) {
    this.popoverContentFn = fn;
  };

  this.setData = function (data) {
    if (!data) {
      return null;
    }

    let total = _.values(data).map(o => parseFloat(o.length)).reduce((a, b) => a + b);
    this.data = Object.keys(data).map(d => ({title: d, val: data[d].length / total, km: data[d].length}))
      .sort((a, b) => getMeta(a).index > getMeta(b).index ? 1 : -1);
    this.update();
  };

  this._init = function () {
    this._calcSize();
    // The svg.
    svg = this.$elChart.append('svg')
        .attr('class', 'chart');

    // Legend element
    legend = this.$elLegend.append('ul')
        .attr('class', 'chart-legend');

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

    let arcs = dataCanvas.selectAll('.piechart-arc')
      .data(pie(this.data));

    arcs.enter().append('path')
      .attr('class', 'piechart-arc')
      .on('mouseover', this._onMouseOver)
      .on('mouseout', this._onMouseOut);

    arcs
      .attr('d', arc)
      .style('fill', d => getMeta(d.data).fill);

    arcs.exit().remove();

    this.renderLegend();
  };

  this.renderLegend = function () {
    let legendItems = legend.selectAll('li')
      .data(this.data);

    let enterLi = legendItems
      .enter()
      .append('li');

    let lKey = enterLi.append('span')
      .datum(d => d)
      .attr('class', 'legend-key')
      .html('&nbsp;');

    lKey.style('background-color', d => getMeta(d).fill);

    let lVal = enterLi.append('span')
      .datum(d => d)
      .attr('class', 'legend-value');

    lVal.text(d => {
      let t = d.title === 'roadTypeUndefined' ? 'Undefined' : titlecase(d.title);
      return `${formatThousands(d.km)}KM | ${t}`;
    });
  };

  this.destroy = function () {
    chartPopover.hide();
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
