import React from 'react';
import {
  map,
  orderBy
} from 'lodash';
import {
  withProps
} from 'recompose';
import ProvinceTableRow from './province-table-row';
import ProvinceTableColumnHeader from './province-table-column-header';
import {
  ADMIN_MAP
} from '../constants';


const ProvinceTable = ({
  provinces, language, sortField, sortOrder, sortHandler
}) => (
  <div className='table'>
    <table>
      <thead>
        <tr>
          {
            [['name', 'Province'], ['field', 'Field'], ['total', 'Total'], ['percentageComplete', 'Progress']]
              .map(([columnKey, columnLabel]) => (
                <ProvinceTableColumnHeader
                  key={columnLabel}
                  columnKey={columnKey}
                  label={columnLabel}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  sortLinkHandler={sortHandler}
                />
              ))
          }
        </tr>
      </thead>
      <tbody>
        {map(
          orderBy(provinces, [sortField], [sortOrder]),
          ({ id, name, routeId, field, total, percentageComplete }) => (
            <ProvinceTableRow
              key={id}
              id={id}
              name={name}
              routeId={routeId}
              field={field}
              total={total}
              percentageComplete={percentageComplete}
              language={language}
            />
          )
        )}
      </tbody>
    </table>
  </div>
);


export default withProps(
  ({ provinces, fieldIdCount, VProMMsCount }) => ({
    provinces: map(provinces, (province) => {
      const id = ADMIN_MAP.province[province.id].id;

      const field = fieldIdCount
        .filter(province => province.admin === id)
        .map(province => province.total_roads)[0] || 0;
      const total = VProMMsCount
        .filter(province => province.admin === id)
        .map(province => parseInt(province.total_roads, 10))[0] || 0;

      return {
        name: ADMIN_MAP.province[province.id].name,
        id,
        routeId: province.id,
        field,
        total,
        percentageComplete: total > 0 ? field / total * 100 : 0
      };
    })
  })
)(ProvinceTable);
