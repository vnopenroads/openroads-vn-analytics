'use strict';
import React from 'react';
import PieChart from './charts/pie-chart';

var AAStats = React.createClass({
  displayName: 'AAStats',

  propTypes: {
    level: React.PropTypes.number,
    activeStat: React.PropTypes.string,
    chandeTabFn: React.PropTypes.func,
    stats: React.PropTypes.object,
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool
  },

  chartPopoverContent: function (d) {
    return <pre>{JSON.stringify(d, null, 1)}</pre>;
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      // Handle better.
      return null;
    }
    let stats = this.props.stats.stats;

    return (
      <div className='aa-stats-wrapper'>

        <div className='aa-stats-row'>
          <div className='aa-stats aa-stats--completeness'>
            <h2 className='hd-s'>Completeness</h2>
            <ul className='aa-stats__list'>
              <li className='aa-stats__element'>
                <strong>35%</strong>complete
              </li>
              <li className='aa-stats__element'>
                <a href='#'><strong>121</strong>Errors to Fix</a>
              </li>
              <li className='aa-stats__element'>
                <a href='#'><strong>8</strong>Projects</a>
              </li>
            </ul>
          </div>
        </div>

        <div className='aa-stats-row'>
          <div className='aa-stats aa-stats--extent'>
            <h2 className='hd-s'>Extent</h2>
            <ul className='aa-stats__list'>
              <li className='aa-stats__element'>
                <ul className='progress-bar'><li style={{width: '100%'}}><span className='progress-value'>217,456Km</span></li></ul>
                <p className='aa-stat__value'><strong>100%</strong>National <small>Roads mapped</small></p>
              </li>
              <li className='aa-stats__element'>
                <ul className='progress-bar'><li style={{width: '18%'}}><span className='progress-value'>50,456Km</span></li></ul>
                <p className='aa-stat__value'><strong>18%</strong>Local <small>Roads mapped</small></p>
              </li>
            </ul>
          </div>
        </div>

        <div className='aa-stats-row'>
          <div className='aa-stats aa-stats--condition'>
            <h2 className='hd-s'>Condition</h2>
            {this.props.fetching ? <p>Loading data</p>
              : this.props.fetched ? <PieChart popoverContentFn={this.chartPopoverContent} data={stats.or_condition} className='piechart'/> : null}
          </div>

          <div className='aa-stats aa-stats--responsibility'>
            <h2 className='hd-s'>Responsibility</h2>
            {this.props.fetching ? <p>Loading data</p>
              : this.props.fetched ? <PieChart popoverContentFn={this.chartPopoverContent} data={stats.or_rdclass} className='piechart'/> : null}
          </div>
        </div>

      </div>
    );
  }
});

module.exports = AAStats;
