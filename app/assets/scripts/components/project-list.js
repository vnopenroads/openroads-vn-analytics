'use strict';
import React from 'react';
import { Link } from 'react-router';
import { formatThousands, formatCurrency, formatTableText } from '../utils/format';

var ProjectList = React.createClass({
  displayName: 'ProjectList',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    adminAreaId: React.PropTypes.number,
    adminAreaName: React.PropTypes.string,
    projects: React.PropTypes.array,
    meta: React.PropTypes.object,
    error: React.PropTypes.string,
    sliceList: React.PropTypes.bool
  },

  renderViewAllLink: function () {
    if (!this.props.sliceList) return null;
    let {limit, total} = this.props.meta;

    if (total > limit) {
      let url = `/analytics/${this.props.adminAreaId}/projects`;
      return <div className='actions'><Link to={url} className='bttn-view-more'>View all projects</Link></div>;
    }
  },

  renderContent: function () {
    let content;
    if (this.props.fetching) {
      content = (<p>Loading projects...</p>
      );
    } else if (this.props.error) {
      content = <p className='aa-stats--empty'>Oops... An error occurred.</p>;
    } else if (!this.props.meta.total) {
      content = <p className='aa-stats--empty'>No errors to show.</p>;
    }

    if (content) {
      return content;
    }

    return (
      <div className='prj-list'>
        <table className='prj-list__table table'>
          <thead>
            <tr>
              <th>Scope</th>
              <th>Type</th>
              <th>Code</th>
              <th>Description</th>
              <th>Year</th>
              <th>Length (km)</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {this.props.projects.map(o => {
              return (
                <tr key={o.id}>
                  <th scope='row'>{formatTableText(o.scope)}</th>
                  <td>{o.type}</td>
                  <td>{o.code}</td>
                  <td>{formatTableText(o.name)}</td>
                  <td>{o.year}</td>
                  <td>{formatThousands(o.length, 1)}</td>
                  <td>{formatCurrency(o.cost, 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {this.renderViewAllLink()}
      </div>
    );
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      return null;
    }

    let title = 'Projects';
    if (this.props.fetched && !this.props.fetching && this.props.meta.total) {
      title += ` (${this.props.meta.total})`;
    }

    return (
      <div className='aa-stats--projects'>
        <h2 className='aa-stats__title'>{title}</h2>
        <div className='aa-stats__contents'>
          {this.renderContent()}
        </div>
      </div>
    );
  }
});

export default ProjectList;
