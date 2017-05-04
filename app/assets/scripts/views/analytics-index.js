'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import c from 'classnames';
import _ from 'lodash';
import { fetchVProMMSids } from '../actions/action-creators';

var AnalyticsIndex = React.createClass({
  displayName: 'AnalyticsIndex',

  propTypes: {
    children: React.PropTypes.object,
    _fetchVProMMSids: React.PropTypes.func,
    VProMMSids: React.PropTypes.object,
    params: React.PropTypes.object
  },

  componentDidMount: function () {
    this.props._fetchVProMMSids();
  },

  render: function () {
    let accumulator = { done: 0, total: 0 };
    const provinceData = _.map(this.props.VProMMSids.data, (data, id) => {
      const name = data.provinceName;
      const done = data.vpromms.filter(v => v.inTheDatabase).length;
      const total = data.vpromms.length;
      accumulator.done += done;
      accumulator.total += total;
      const percentageComplete = (done / total).toFixed(2);
      return {
        id,
        name,
        done,
        total,
        percentageComplete
      };
    });
    const { done, total } = accumulator;
    return (
      <section className='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            <h2 className='complete'>{((accumulator.done / accumulator.total) * 100).toFixed(2)} % of VProMMS Ids added ({done.toLocaleString()} of {total.toLocaleString()})</h2>
            <h3>Province Breakdown:</h3>
            <div className='table'>
              <table>
                <thead>
                  <tr key={1}>
                    <th>Province</th>
                    <th>Done</th>
                    <th>Total</th>
                    <th>% Complete</th>
                  </tr>
                </thead>
                <tbody>
                {_.map(provinceData, (province, i) => {
                  return (
                    <tr key={`province-${province.id}`} className={c({'alt': i % 2})}>
                      <td><Link to={`analytics/${province.id}`}>{province.name}</Link></td>
                      <td>{province.done}</td>
                      <td>{province.total}</td>
                      <td>{!isNaN(province.done / province.total) ? `${((province.done / province.total * 100)).toFixed(2)}% Complete` : '0.00% Complete'}</td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    VProMMSids: state.VProMMSids
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMSids: (aaid) => dispatch(fetchVProMMSids())
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsIndex);
