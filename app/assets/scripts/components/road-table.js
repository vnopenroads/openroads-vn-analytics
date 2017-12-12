import React from 'react';
import _ from 'lodash';
import ColumnHeader from './road-table-column-header';
import Row from '../containers/road-table-row-container';
import T from './t';


const RoadTable = ({
  adminRoadProperties, adminRoads, fieldRoads,
  sortOrder, sortColumnAction
}) => (
  <div className='table'>
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
        {_.map(
          _.orderBy(adminRoads, _.identity, [sortOrder]),
          (vpromm) => (
            <Row
              key={vpromm}
              vpromm={vpromm}
              adminRoadProperties={adminRoadProperties}
              vprommFieldInDB={fieldRoads.includes(vpromm)}
            />
          )
        )}
      </tbody>
    </table>
  </div>
);


RoadTable.propTypes = {
  adminRoads: React.PropTypes.array,
  fieldRoads: React.PropTypes.array,
  language: React.PropTypes.string,
  adminRoadProperties: React.PropTypes.array
};


export default RoadTable;
