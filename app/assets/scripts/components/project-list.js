'use strict';
import React from 'react';
import titlecase from 'titlecase';

var ProjectList = React.createClass({
  displayName: 'ProjectList',

  propTypes: {
    data: React.PropTypes.array
  },

  render: function () {
    console.log(this.props.data);
    let rows = this.props.data.map(d => (
      <tr>
        <td>{titlecase(d.name)}</td>
        <td>{titlecase(d.type)}</td>
        <td>{titlecase(d.status)}</td>
      </tr>
    ));
    return (
      <div className='prj-list'>
        <table className='prj-list__table'>
          <thead>
            <tr>
              <td>Names</td>
              <td>Type</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }

});

export default ProjectList;
