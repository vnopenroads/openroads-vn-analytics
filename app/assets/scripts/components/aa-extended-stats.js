'use strict';
import React from 'react';
import titlecase from 'titlecase';
import PieChart from './charts/pie-chart';
// import ProjectList from './project-list';
import {formatPercent} from '../utils/format';
// import mockProjects from '../mock/projects';

var AAExtendedStats = React.createClass({
  displayName: 'AAExtendedStats',

  propTypes: {
    level: React.PropTypes.number,
    stats: React.PropTypes.object,
    error: React.PropTypes.string,
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool
  },

  chartPopoverContent: function (d) {
    let title = d.data.title === 'roadTypeUndefined' ? 'Undefined' : d.data.title;
    return <span className="piechart-popover">{formatPercent(d.data.val)} | {titlecase(title)}</span>;
  },

  renderChart: function (dataField) {
    if (this.props.fetching) {
      return <p>Loading data</p>;
    } else if (this.props.fetched) {
      return this.props.error || !this.props.stats[dataField]
        ? <p>No data available</p>
        : <PieChart popoverContentFn={this.chartPopoverContent} data={this.props.stats[dataField]} className='piechart'/>;
    }
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      return null;
    }
    // let projects = mockProjects(8);

    // sanitize extent numbers
    let extent = this.props.stats && this.props.stats.extent;
    let isValidExtent = extent &&
      extent.national.length &&
      extent.local.length &&
      !isNaN(extent.national.length) &&
      !isNaN(extent.local.length);

    return (
      <div className='aa-stats-wrapper'>

        {!isValidExtent ? null : (
          <div className='aa-stats-row'>
            <div className='aa-stats aa-stats--extent'>
              <h2 className='aa-stats__title'>Extent (Roads mapped)</h2>
              <div className='aa-stats__contents'>
                <ul className='aa-stats__list'>
                  <li className='aa-stats__element'>
                    <p className='aa-stat__value'><strong>{formatPercent(extent.national.length)}</strong>National</p>
                    <ul className='progress-bar progress-bar--high'>
                      <li style={{width: formatPercent(extent.national.length, 100)}}></li>
                    </ul>
                  </li>
                  <li className='aa-stats__element'>
                    <p className='aa-stat__value'><strong>{formatPercent(extent.local.length)}</strong>Local</p>
                    <ul className='progress-bar progress-bar--low'>
                      <li style={{width: formatPercent(extent.local.length, 100)}}></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className='aa-stats-row'>
          <div className='aa-stats aa-stats--condition'>
            <h2 className='aa-stats__title'>Condition</h2>
            <div className='aa-stats__contents'>
              {this.renderChart('or_condition')}
            </div>
          </div>

          <div className='aa-stats aa-stats--responsibility'>
            <h2 className='aa-stats__title'>Responsibility</h2>
            <div className='aa-stats__contents'>
              {this.renderChart('or_responsibility')}
            </div>
          </div>
        </div>

        {/*
        <div className='aa-stats-row'>
          <div className='aa-stats aa-stats--projects'>
            <h2 className='aa-stats__title'>Projects{this.props.fetched ? ` (${projects.length} in progress)`
              : null
            }</h2>
            <div className='aa-stats__contents'>
              {this.props.fetched ? <ProjectList data={projects}/> : null}
            </div>
          </div>
        </div>
        */}
      </div>
    );
  }
});

module.exports = AAExtendedStats;
