'use strict';
import React from 'react';

var AAStats = React.createClass({
  displayName: 'AAStats',

  propTypes: {
    level: React.PropTypes.number,
    activeStat: React.PropTypes.string,
    chandeTabFn: React.PropTypes.func
  },

  render: function () {
    return (
      <div className='aa-stats'>
        <div className='aa-stats-completeness'>
          <h2 className='hd-s'>Completeness</h2>
          <ul className="aa-stats-list">
            <li className="aa-stat"><div className='chart-placeholder' /></li>
            <li className="aa-stat"><div className='chart-placeholder' /></li>
            <li className="aa-stat"><div className='chart-placeholder' /></li>
          </ul>
        </div>

        <div className='aa-stats-extent'>
          <h2 className='hd-s'>Extent</h2>
          <ul className="aa-stats-list">
            <li className="aa-stat"><div className='chart-placeholder' /></li>
            <li className="aa-stat"><div className='chart-placeholder' /></li>
          </ul>
        </div>

        <div className='aa-stats-condition'>
          <h2 className='hd-s'>Condition</h2>
          <ul className="aa-stats-list">
            <li className="aa-stat"><div className='chart-placeholder' /></li>
            <li className="aa-stat"><div className='chart-placeholder' /></li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = AAStats;
