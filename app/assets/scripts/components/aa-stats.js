'use strict';
import React from 'react';
import Dropdown from '../components/dropdown';
import ID from '../utils/id';
import { formatThousands, formatPercent } from '../utils/format';

var AAStats = React.createClass({
  displayName: 'AAStats',

  propTypes: {
    stats: React.PropTypes.object,
    adminAreas: React.PropTypes.array,
    tofixtasks: React.PropTypes.object,
    projecttasks: React.PropTypes.object,
    projects: React.PropTypes.object
  },

  render: function () {
    let subregions = null;
    if (this.props.adminAreas && this.props.adminAreas.length) {
      subregions = {
        // https://github.com/developmentseed/openroads/issues/298
        // No harm using the last admin area instead of the first.
        id: new ID(this.props.adminAreas[this.props.adminAreas.length - 1].id),
        count: this.props.adminAreas.length
      };
    }

    let tasksCount = null;
    if (this.props.tofixtasks.fetched && !this.props.tofixtasks.fetching) {
      tasksCount = this.props.tofixtasks.data.tasks.meta.total;
    }
    if (this.props.projecttasks.fetched && !this.props.projecttasks.fetching) {
      tasksCount = (tasksCount || 0) + this.props.projecttasks.data.projecttasks.meta.total;
    }

    tasksCount = tasksCount || '-';

    let completeness = formatPercent(this.props.stats && this.props.stats.completeness && this.props.stats.completeness.length);

    let projects = '-';
    if (this.props.projects.fetched) {
      projects = formatThousands(this.props.projects.data.projects.meta.total);
    }

    return (
      <div className='aa-stats-row aa-stats-row--completeness'>
        <div className='inner'>
          <div className='aa-stats aa-stats--completeness'>
            <h2 className='aa-stats__title'>Admin area stats</h2>
            <ul className='aa-stats__list'>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  <strong><span className='highlight'>{completeness}</span> Complete</strong>
                  <Dropdown element='span' className='dropdown left' triggerClassName='bttn-info' triggerText='View additional info' evtClick={false}>
                    <div className='aa-stats-info'>
                      <p>Completeness of this area's road network, based on it's extent and number of issues.</p>
                    </div>
                  </Dropdown>
                </div>
              </li>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  <strong><span className='highlight'>{formatThousands(tasksCount)}</span> Errors detected</strong>
                </div>
              </li>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  <strong><span className='highlight'>{projects}</span> Projects</strong>
                </div>
              </li>
              <li className='aa-stats__element'>
                <div className='wrapper'>
                  {subregions ? (
                    <strong><span className='highlight'>{subregions.count}</span> {subregions.id.getDisplayType(subregions.count !== 1)}</strong>
                    ) : (
                    <strong><span className='highlight'>-</span></strong>
                    )}
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
