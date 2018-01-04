import React from 'react';
import {
  compose,
  withStateHandlers,
  getContext,
  withProps
} from 'recompose';
import ProvinceTable from '../components/province-table';
import {
  ADMIN_MAP
} from '../constants';


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
  ),
  withProps(({ provinces, provincesRoadCount }) => ({
    provinces: provinces.map((province) => {
      const { id, name } = ADMIN_MAP.province[province.id];
      const { count, osmCount } = provincesRoadCount[id];

      return {
        name,
        id,
        routeId: province.id,
        osmCount,
        count,
        percentageComplete: count > 0 ? osmCount / count * 100 : 0
      };
    })
  }))
)(ProvinceTable);


export default ProvinceTableContainer;
