'use strict';
import React from 'react';
import Dropdown from '../components/dropdown';
import ID from '../utils/id';
import { formatThousands } from '../utils/format';

var AAStats = React.createClass({
  displayName: 'AAStats',

  propTypes: {
    adminAreas: React.PropTypes.array,
    tofixtasks: React.PropTypes.object
  },

  render: function () {
    let subregions = null;
    if (this.props.adminAreas && this.props.adminAreas.length) {
      subregions = {
        id: new ID(this.props.adminAreas[0].id),
        count: this.props.adminAreas.length
      };
    }

    let tofixtasks = null;
    if (this.props.tofixtasks.fetched && !this.props.tofixtasks.fetching) {
      tofixtasks = this.props.tofixtasks.data.tasks.meta.total;
    }

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
                {tofixtasks !== null ? <a href='#' className='aa-stats__link'><strong><span className='highlight'>{formatThousands(tofixtasks)}</span> Errors to Fix</strong></a> : null}
                </div>
              </li>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  <a href='#' className='aa-stats__link'><strong><span className='highlight'>8</span> Projects</strong></a>
                </div>
              </li>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  {subregions ? (<a href='#' className='aa-stats__link'><strong><span className='highlight'>{subregions.count}</span> {subregions.id.getDisplayType(subregions.count !== 1)}</strong></a>) : null}
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
