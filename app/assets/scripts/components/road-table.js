import React from 'react';
import _ from 'lodash';
import ColumnHeader from './road-table-column-header';
import Row from '../containers/road-table-row-container';
import CreateRoadForm from '../containers/create-road-form-container';
import RoadPagination from './road-pagination';
import RoadProgressBar from './road-progress-bar';
import T from './t';


const RoadTable = ({
  fieldRoads, roadsPage, roadsPageStatus,
  roadCount, roadPageCount, roadCountStatus,
  page, sortOrder,
  sortColumnAction, setPage
}) => (
  <div className="table-container">
    {
      roadCountStatus === 'complete' && roadCount > 0 &&
        <RoadProgressBar
          fieldCount={fieldRoads.length}
          roadCount={roadCount}
        />
    }

    <CreateRoadForm />

    {roadsPageStatus === 'pending' ?
      <div className='a-subnav loading'><h2><T>Loading</T></h2></div> :
      <div className="table">
        <table>
          <thead>
            <tr>
              <th className="table-properties-head button-column" />
              <ColumnHeader
                columnKey="id"
                label="VPRoMMS ID"
                sortField="id"
                sortOrder={sortOrder}
                sortColumnAction={sortColumnAction}
              />
              <th className='table-properties-head'><T>Field Data</T></th>
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
  fieldRoads: React.PropTypes.array,
  roadsPage: React.PropTypes.array,
  roadPageCount: React.PropTypes.number
};


export default RoadTable;
