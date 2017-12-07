// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)
import React from 'react';
import {
  compose,
  getContext,
  withStateHandlers
} from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';
import AATableColumnHeader from './aa-table-vpromms-column-header';
import AATableRow from './aa-table-vpromms-row';
import T from './t';


const AATable = ({
  adminRoadProperties, data, fieldRoads, adminRoadPropertiesFetched, language,
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
              fieldRoads={fieldRoads}
              adminRoadProperties={adminRoadProperties}
              adminRoadPropertiesFetched={adminRoadPropertiesFetched}
              vprommFieldInDB={fieldRoads.includes(vpromm)}
              language={language}
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
  adminRoadProperties: React.PropTypes.array,
  adminRoadPropertiesFetched: React.PropTypes.bool
};


export default compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    state => ({
      fieldIds: state.fieldVProMMsids.ids,
      adminRoadProperties: state.VProMMsAdminProperties.data,
      adminRoadPropertiesFetched: state.VProMMsAdminProperties.fetched
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
