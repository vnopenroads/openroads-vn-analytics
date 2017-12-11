// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)
import React from 'react';
import _ from 'lodash';
import ColumnHeader from './road-table-column-header';
import Row from '../containers/road-table-row-container';
import T from './t';


const RoadTable = ({
  adminRoadProperties, data, fieldRoads,
  sortField, sortOrder, sortColumnAction
}) => (
  <div className='table'>
    <table>
      <thead>
        <tr>
          <th className="table-properties-head button-column" />
          <ColumnHeader
            columnKey="id"
            label="VPRoMMS ID"
            sortField={sortField}
            sortOrder={sortOrder}
            sortColumnAction={sortColumnAction}
          />
          <th className='table-properties-head'><T>Field Data</T></th>
          <th className='table-properties-head'><T>Properties</T></th>
        </tr>
      </thead>
      <tbody>
        {_.map(
          _.orderBy(data, _.identity, [sortOrder]),
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
  data: React.PropTypes.array,
  fieldRoads: React.PropTypes.array,
  language: React.PropTypes.string,
  adminRoadProperties: React.PropTypes.array
};


export default RoadTable;
