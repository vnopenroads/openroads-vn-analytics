'use strict';
import React from 'react';
import _ from 'lodash';
import { t } from '../utils/i18n';

import AATable from '../components/aa-table-index';

var AnalyticsIndex = React.createClass({
  displayName: 'AnalyticsIndex',

  propTypes: {
    children: React.PropTypes.object,
    _fetchVProMMsids: React.PropTypes.func,
    VProMMSids: React.PropTypes.object,
    params: React.PropTypes.object
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
    const completion = (accumulator.done / accumulator.total) * 100;
    return (
      <div>
        <div className='a-header'>
          <div className='a-headline'>
            <h1>{t('VProMMS Edits By Province')}</h1>
          </div>
        </div>

        <div className='a-main__status'>
          <h2><strong>{completion.toFixed(2)}%</strong> {t('of VProMMS Ids added')} ({done.toLocaleString()} of {total.toLocaleString()})</h2>
          <div className='meter'>
            <div className='meter__internal' style={{width: `${completion}%`}}></div>
          </div>
        </div>
        <div>
          <AATable data={provinceData} />
        </div>
      </div>
    );
  }
});

export default AnalyticsIndex;
