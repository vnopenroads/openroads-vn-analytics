'use strict';
import React from 'react';
import titlecase from 'titlecase';
import PieChart from './charts/pie-chart';
import _ from 'lodash';
import classnames from 'classnames';
import { Link } from 'react-router';
import {formatPercent, formatThousands} from '../utils/format';
// import ProjectList from './project-list';
// import mockProjects from '../mock/projects';

var AAExtendedStats = React.createClass({
  displayName: 'AAExtendedStats',

  propTypes: {
    level: React.PropTypes.number,
    stats: React.PropTypes.object,
    adminAreaId: React.PropTypes.number,
    bbox: React.PropTypes.array,
    error: React.PropTypes.string,
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool
  },

  // TODO: Define thresholds.
  thresholds: [30, 70],

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

  renderExtentBar: function (extentPercent, extentValue, estimatedValue, type) {
    // The estimate bar width depends on the mappend km.
    // It will be 100% while it's greater than the mapped
    let estNat = 1;
    if (estimatedValue < extentValue) {
      estNat = estimatedValue / extentValue;
    }

    // Top extentPercent to 100.
    extentPercent = formatPercent(extentPercent, 100);
    let val = parseFloat(extentPercent);
    let colorCoding = {
      'progress-bar--low': val < this.thresholds[0],
      'progress-bar--med': val >= this.thresholds[0] && val <= this.thresholds[1],
      'progress-bar--high': val > this.thresholds[1]
    };

    let source = null;
    if (type === 'national') {
      source = (
        <span>(Source <a href=''>DPWH</a>)</span>
      );
    } else if (type === 'local') {
      source = (
        <span>(Source <a href=''>OSM</a>)</span>
      );
    }

    return (
      <div>
        <ul className={classnames('progress-bar', colorCoding)}>
          <li style={{width: extentPercent}}>
            <p className='value'><strong>{formatThousands(extentValue)} KM</strong> Road mapped</p>
          </li>
        </ul>
        <ul className='progress-bar'>
          <li style={{width: formatPercent(estNat)}}>
            <p className='value'><strong>{formatThousands(estimatedValue)} KM</strong> Road estimate {source}</p>
          </li>
        </ul>
      </div>
    );
  },

  renderTaggedBar: function (stat) {
    let total = _.values(stat).map(o => o.length).reduce((a, b) => a + b);
    let complete = total - stat.roadTypeUndefined.length;
    let val = Math.round(complete / total * 1000) / 10;

    let colorCoding = {
      'progress-bar--low': val < this.thresholds[0],
      'progress-bar--med': val >= this.thresholds[0] && val <= this.thresholds[1],
      'progress-bar--high': val > this.thresholds[1]
    };

    return (
      <ul className={classnames('progress-bar progress-bar--inline', colorCoding)}>
        <li style={{width: val + '%'}}>
          <p className='value'>{val}%</p>
        </li>
      </ul>
    );
  },

  renderRoadStats: function () {
    if (this.props.fetching) {
      return <p>Loading data</p>;
    }

    // sanitize extent numbers
    var extent = this.props.stats.extent;
    if (isNaN(_.get(extent, 'national.lengths', null)) ||
        isNaN(_.get(extent, 'local.lengths', null))) {
      return null;
    }

    let estimated = this.props.stats.estimatedLength;
    if (isNaN(_.get(estimated, 'national.lengths', null)) ||
        isNaN(_.get(estimated, 'local.lengths', null))) {
      return null;
    }

    let url = this.props.adminAreaId ? `/analytics/${this.props.adminAreaId}/tasks` : '/analytics/tasks';
    let $tasksLink = <Link to={url} className='bttn-view-more'>Check tasks</Link>;

    let $editorLink = <Link to={`/editor/bbox=${this.props.bbox.join('/')}`} className='bttn-view-more'>Edit Roads</Link>;

    return (
        <div className='aa-stats aa-stats--extent'>
          <h2 className='aa-stats__title'>Map Completeness</h2>
          <div className='aa-stats__description'>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio reiciendis iste beatae laboriosam
            aliquam molestiae incidunt repudiandae recusandae fugiat minus ullam eveniet, laborum dolorum!
            Quisquam eaque ipsa aut illum. Doloremque!</p>
          </div>
          <div className='aa-stats__contents'>
            <ul className='aa-stats__list'>
              <li className='aa-stats__element'>
                <h3>Extent</h3>
                <div className='wrapper'>
                  <p className='aa-stat__value'><strong>{formatPercent(extent.national.length)}</strong>National roads mapped</p>
                  {this.renderExtentBar(extent.national.length, extent.nationalKm.length, estimated.national.length, 'national')}
                </div>

                <div className='wrapper'>
                  <p className='aa-stat__value'><strong>{formatPercent(extent.local.length)}</strong>Local roads mapped</p>
                  {this.renderExtentBar(extent.local.length, extent.localKm.length, estimated.local.length, 'local')}
                </div>

                {$editorLink}
              </li>
              <li className='aa-stats__element roads-tagged'>
                <h3>Roads Tagged</h3>
                <p className='aa-stat__value'>Condition</p>
                {this.renderTaggedBar(this.props.stats.or_condition)}

                <p className='aa-stat__value'>Surface</p>
                {this.renderTaggedBar(this.props.stats.surface)}

                <p className='aa-stat__value'>Responsibility</p>
                {this.renderTaggedBar(this.props.stats.or_responsibility)}

                {$tasksLink}
              </li>
            </ul>
          </div>
        </div>
    );
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      return null;
    }
    // let projects = mockProjects(8);

    return (
      <div className='aa-stats-wrapper'>
        <div className='aa-stats-row'>
          {this.renderRoadStats()}
        </div>

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
