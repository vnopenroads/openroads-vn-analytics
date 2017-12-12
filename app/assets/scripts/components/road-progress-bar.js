import React from 'react';
import {
  withProps
} from 'recompose';
import T from './t';


const RoadProgressBar = ({ percent, fieldCount, roadCount }) => (
  <div className='a-main__status'>
    <h2>
      <strong>{percent}</strong>
      <span>% <T>of VPRoMMS Ids have field data</T> <em>({fieldCount} / {roadCount})</em></span>
    </h2>
    <div className='meter'>
      <div className='meter__internal' style={{width: `${percent}%`}}></div>
    </div>
  </div>
);


export default withProps(({ fieldCount, roadCount }) => ({
  percent: roadCount === 0 ?
    0 :
    ((fieldCount / roadCount) * 100).toFixed(2)
}))(RoadProgressBar);
