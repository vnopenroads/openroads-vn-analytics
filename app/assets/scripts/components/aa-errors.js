'use strict';
import React from 'react';
import { Link } from 'react-router';
import {formatThousands} from '../utils/format';

var AAErrors = React.createClass({
  displayName: 'AAErrors',

  propTypes: {
    adminAreaId: React.PropTypes.number,
    tofixtasks: React.PropTypes.object,
    projecttasks: React.PropTypes.object
  },

  render: function () {
    let tofixtasks = '-';
    if (this.props.tofixtasks.fetched && !this.props.tofixtasks.fetching) {
      tofixtasks = this.props.tofixtasks.data.tasks.meta.total;
    }

    let projecttasks = '-';
    if (this.props.projecttasks.fetched && !this.props.projecttasks.fetching) {
      projecttasks = this.props.projecttasks.data.projecttasks.meta.total;
    }

    return (
    <div className='aa-stats aa-stats--extent aa-errors'>
      <h2 className='aa-stats__title'>Errors Detected</h2>
      <div className='aa-stats__description'>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio reiciendis iste beatae laboriosam
        aliquam molestiae incidunt repudiandae recusandae fugiat minus ullam eveniet, laborum dolorum!
        Quisquam eaque ipsa aut illum. Doloremque!</p>
      </div>
      <div className='aa-stats__contents'>
        <ul className='aa-stats__list'>
          <li className='aa-stats__element'>
            <p className='aa-stat__value'><strong>{formatThousands(tofixtasks)}</strong><Link to={`/analytics/${this.props.adminAreaId}/tasks`}>Missing Properties</Link></p>
          </li>
          <li className='aa-stats__element'>
            <p className='aa-stat__value'><strong>{formatThousands(projecttasks)}</strong><Link to={`/analytics/${this.props.adminAreaId}/projecttasks`}>Missing Roads</Link></p>
          </li>
        </ul>
      </div>
    </div>
    );
  }
});

module.exports = AAErrors;
