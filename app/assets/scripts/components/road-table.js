import React from 'react';
import _ from 'lodash';
import ColumnHeader from './road-table-column-header';
import Row from '../containers/road-table-row-container';
import CreateRoadForm from '../containers/create-road-form-container';
import T from './t';


const RoadTable = ({
  adminRoadProperties, fieldRoads, roadsPage, roadsPageStatus,
  sortOrder, sortColumnAction
}) => (
  <div>
    <CreateRoadForm />

    <div className="table">
      {roadsPageStatus === 'pending' ?
        <div className='a-subnav loading'><h2><T>Loading</T></h2></div> :
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
      }
    </div>
  </div>
);


RoadTable.propTypes = {
  fieldRoads: React.PropTypes.array,
  roadsPage: React.PropTypes.array,
  language: React.PropTypes.string,
  adminRoadProperties: React.PropTypes.array
};


export default RoadTable;
