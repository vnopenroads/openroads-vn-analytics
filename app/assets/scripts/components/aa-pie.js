'use strict';
import React from 'react';
import hat from 'hat';
import _ from 'lodash';

var AAPie = React.createClass({
  displayName: 'AAPie',

  propTypes: {
  },

  chart: null,
  chartId: null,
  onWindowResize: function () {
    this.chart.update()
  },

  componentWillMount: function () {
    this.chartId = 'piechart-' + hat()
  },

  componentDidMount: function () {
    this.onWindowResize = _.debounce(this.onWindowResize, 200);
    window.addEventListener('resize', this.onWindowResize);
    this.chart = new Pie(this.chartId, this.props);
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.onWindowResize);
    // this.chart.destroy();
  },

  componentDidUpdate: function () {
    // this.chart.setData(this.props);
  },

  render: function () {
    return <div className="pie-chart" id={this.chartId}></div>;
  }
});

var Pie = function (id, props) {

}

module.exports = AAPie;
