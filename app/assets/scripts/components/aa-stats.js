'use strict';
import React from 'react';
import Dropdown from '../components/dropdown';

var AAStats = React.createClass({
  displayName: 'AAStats',

  propTypes: {
    stats: React.PropTypes.object,
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      // Handle better.
      return null;
    }
    let stats = this.props.stats.stats;

    return (
      <div className='aa-stats-row aa-stats-row--completeness'>
        <div className='inner'>
          <div className='aa-stats aa-stats--completeness'>
            <h2 className='aa-stats__title'>Admin area stats</h2>
            <ul className='aa-stats__list'>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  <strong><span className='highlight'>35%</span> Complete</strong>
                  <Dropdown element='span' className='dropdown left' triggerTitle='View additional info' triggerClassName='bttn-info' triggerText='View additional info'>
                    <div className='aa-stats-info'>
                      <dl>
                        <dd>Condition:</dd>
                        <dt>somewhat stable</dt>
                      </dl>
                      <p>we have clocks but what about a long text.</p>
                    </div>
                  </Dropdown>
                </div>
              </li>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  <strong><span className='highlight'>$2.5M</span> Asset Value</strong>
                  <Dropdown element='span' className='dropdown right' triggerTitle='View additional info' triggerClassName='bttn-info' triggerText='View additional info'>
                    <div className='aa-stats-info'>
                      <dl>
                        <dd>Condition:</dd>
                        <dt>somewhat stable</dt>
                      </dl>
                      <p>we have clocks but what about a long text.</p>
                    </div>
                  </Dropdown>
                </div>
              </li>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  <a href='#' className='aa-stats__link'><strong><span className='highlight'>121</span> Errors to Fix</strong></a>
                </div>
              </li>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  <a href='#' className='aa-stats__link'><strong><span className='highlight'>8</span> Projects</strong></a>
                </div>
              </li>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  <a href='#' className='aa-stats__link'><strong><span className='highlight'>50</span> Municipalities</strong></a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AAStats;
