import React from 'react';
import _ from 'lodash';
import ColumnHeader from './road-table-column-header';
import Row from '../containers/road-table-row-container';
import CreateRoadForm from '../containers/create-road-form-container';
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

    <CreateRoadForm />

    {
      roadsPageStatus === 'pending' ?
        <div className='a-subnav loading'><h2><T>Loading</T></h2></div> :
        roadsPageStatus === 'error' ?
          <div className='a-subnav error'><h2><T>Error</T></h2></div> :
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th className="table-properties-head button-column" />
                  <ColumnHeader
                    columnKey="id"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    sortColumnAction={sortColumnAction}
                  >
                    <T>VPRoMMS ID</T>
                  </ColumnHeader>
                  <ColumnHeader
                    columnKey="hasOSMData"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    sortColumnAction={sortColumnAction}
                  >
                    <T>Field Data</T>
                  </ColumnHeader>
                  <th className='table-properties-head'><T>Properties</T></th>
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
