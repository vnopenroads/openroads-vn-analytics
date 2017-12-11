// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)
import React from 'react';
import {
  compose,
  withStateHandlers
} from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';
import AATableColumnHeader from './aa-table-vpromms-column-header';
import AATableRow from '../containers/aa-table-vpromms-container';
import T from './t';


const AATable = ({
  adminRoadProperties, data, fieldRoads,
  sortField, sortOrder, sortColumnAction
}) => (
  <div className='table'>
    <table>
      <thead>
        <tr>
          <th className="table-properties-head button-column" />
          <AATableColumnHeader
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
            <AATableRow
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


AATable.propTypes = {
  data: React.PropTypes.array,
  fieldRoads: React.PropTypes.array,
  language: React.PropTypes.string,
  adminRoadProperties: React.PropTypes.array
};


export default compose(
  connect(
    state => ({
      fieldIds: state.fieldVProMMsids.ids,
      adminRoadProperties: state.VProMMsAdminProperties.data
    })
  ),
  withStateHandlers(
    { sortField: 'id', sortOrder: 'asc' },
    {
      sortColumnAction: ({ sortField, sortOrder }) => (field) => (
        sortField === field ?
          { sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' } :
          { sortField: field, sortOrder: 'asc' }
      )
    }
  )
)(AATable);
