import React from 'react';
import _ from 'lodash';
import ColumnHeader from './road-table-column-header';
import Row from '../containers/road-table-row-container';
import CreateRoadForm from '../containers/create-road-form-container';
import RoadPagination from './road-pagination';
import T from './t';


const RoadTable = ({
  adminRoadProperties, fieldRoads, roadsPage, roadPageCount, roadCountStatus, roadsPageStatus, sortOrder,
  sortColumnAction, setPage
}) => (
  <div>
    <CreateRoadForm />

    {roadsPageStatus === 'pending' ?
      <div className='a-subnav loading'><h2><T>Loading</T></h2></div> :
      <div>
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
                  adminRoadProperties={adminRoadProperties}
                  vprommFieldInDB={fieldRoads.includes(vpromm)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <RoadPagination
          roadPageCount={roadPageCount}
          setPage={setPage}
        />
      </div>
    }
  </div>
);


RoadTable.propTypes = {
  roadsPage: React.PropTypes.array,
  roadPageCount: React.PropTypes.number
};


export default RoadTable;
