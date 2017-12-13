import React from 'react';
import _ from 'lodash';
import ProvinceTableRow from './province-table-row';
import ProvinceTableColumnHeader from './province-table-column-header';


const ProvinceTable = ({ data, language, sortField, sortOrder, sortHandler }) => (
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
        {_.map(
          _.orderBy(data, [sortField], [sortOrder]),
          ({ id, name, route, field, total }) => (
            <ProvinceTableRow
              key={id}
              id={id}
              name={name}
              route={route}
              field={field}
              total={total}
              language={language}
            />
          )
        )}
      </tbody>
    </table>
  </div>
);


export default ProvinceTable;
