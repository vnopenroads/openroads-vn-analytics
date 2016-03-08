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

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      // Handle better.
      return null;
    }

    return (
      <div className='aa-stats-wrapper'>

        <div className='aa-stats-row'>
          <div className='aa-stats aa-stats--completeness'>
            <h2 className='hd-s'>Completeness</h2>
            <ul className="aa-stats__list">
              <li className='aa-stats__element'>
                <p className='aa-stat__value'>35%<small>complete</small></p>
              </li>
              <li className='aa-stats__element'>
                <a className='aa-stat__value'>121<small>Errors to Fix</small></a>
              </li>
              <li className='aa-stats__element'>
                <a className='aa-stat__value'>8<small>Projects</small></a>
              </li>
            </ul>
          </div>
        </div>

        <div className='aa-stats-row'>
          <div className='aa-stats aa-stats--extent'>
            <h2 className='hd-s'>Extent</h2>
            <ul className="aa-stats__list">
              <li className='aa-stats__element'>
                <ul className='progress-bar'><li style={{width: '100%'}}><span className='progress-value'>217,456Km</span></li></ul>
                <p className='aa-stat__value'>100%</p>
                <p className='aa-stat__description'>National <small>Roads mapped</small></p>
              </li>
              <li className='aa-stats__element'>
                <ul className='progress-bar'><li style={{width: '18%'}}><span className='progress-value'>50,456Km</span></li></ul>
                <p className='aa-stat__value'>18%</p>
                <p className='aa-stat__description'>Local <small>Roads mapped</small></p>
              </li>
            </ul>
          </div>
        </div>

        <div className='aa-stats-row'>
          <div className='aa-stats aa-stats--condition'>
            <h2 className='hd-s'>Condition</h2>
            {this.props.fetching
              ? <p>Loading data</p>
              : <PieChart />}
          </div>

          <div className='aa-stats aa-stats--responsibility'>
            <h2 className='hd-s'>Responsibility</h2>
            {this.props.fetching
              ? <p>Loading data</p>
              : <PieChart />}
          </div>
        </div>

      </div>
    );
  }
});

module.exports = AAStats;
