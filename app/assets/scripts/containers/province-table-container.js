import React from 'react';
import {
  compose,
  withStateHandlers,
  getContext
} from 'recompose';
import ProvinceTable from '../components/province-table';


const ProvinceTableContainer = compose(
  getContext({ language: React.PropTypes.string }),
  withStateHandlers(
    { sortField: 'name', sortOrder: 'asc' },
    {
      sortHandler: ({ sortField, sortOrder }) => (field) => (
        sortField === field ?
          { sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' } :
          { sortField: field, sortOrder: 'asc' }
      )
    }
  )
)(ProvinceTable);


export default ProvinceTableContainer;
