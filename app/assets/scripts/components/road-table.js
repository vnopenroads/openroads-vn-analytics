import React from 'react';
import _ from 'lodash';
import Row from '../containers/road-table-row-container';
import RoadPagination from './road-pagination';
import RoadProgressBar from './road-progress-bar';
import T from './t';


const RoadTable = ({
  roadsPage, roadsPageStatus,
  roadCount, roadPageCount, roadOsmCount, roadCountStatus,
  page, sortField, sortOrder,
  sortColumnAction, setPage
}) => (
  <div className="table-container">
    {
      roadCountStatus === 'complete' && roadCount > 0 &&
        <RoadProgressBar
          roadOsmCount={roadOsmCount}
          roadCount={roadCount}
        />
    }
    {
      roadsPageStatus === 'pending' ?
        <div className='a-subnav loading'><h2><T>Loading</T></h2></div> :
        roadsPageStatus === 'error' ?
          <div className='a-subnav error'><h2><T>Error</T></h2></div> :
          <div className="table a-table">
            <table>
              <thead>
                <tr>
                  <th className='table-properties-head'><T>VPRoMMS ID</T></th>
                  <th className='table-properties-head'><T>Field Data</T></th>
                </tr>
              </thead>
              <tbody>
                {_.map(roadsPage, (vpromm) => (
                  <Row
                    key={vpromm}
                    vpromm={vpromm}
                  />
                ))}
              </tbody>
            </table>
          </div>
    }
    {
      roadCountStatus === 'complete' &&
        <RoadPagination
          page={page}
          roadPageCount={roadPageCount}
          setPage={setPage}
        />
    }
  </div>
);


RoadTable.propTypes = {
  roadsPage: React.PropTypes.array,
  roadPageCount: React.PropTypes.number
};


export default RoadTable;
