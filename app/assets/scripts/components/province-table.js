import React from 'react';
import {
  map,
  orderBy
} from 'lodash';
import ProvinceTableRow from './province-table-row';
import ProvinceTableColumnHeader from './province-table-column-header';


const ProvinceTable = ({
  provinces, language, sortField, sortOrder, sortHandler
}) => (
  <div className='table'>
    <table>
      <thead>
        <tr>
          {
            [['name', 'Province'], ['osmCount', 'Field'], ['count', 'Total'], ['percentageComplete', 'Progress']]
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
          ({ id, name, routeId, osmCount, count, percentageComplete }) => (
            <ProvinceTableRow
              key={id}
              id={id}
              name={name}
              routeId={routeId}
              osmCount={osmCount}
              count={count}
              percentageComplete={percentageComplete}
              language={language}
            />
          )
        )}
      </tbody>
    </table>
  </div>
);


export default ProvinceTable;
