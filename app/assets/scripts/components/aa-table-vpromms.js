// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)
import React from 'react';
import {
  compose,
  getContext,
  withHandlers,
  withStateHandlers
} from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';
import { api } from '../config';
import { Link } from 'react-router';
import T from './t';


const TableColumnHeader = withHandlers({
  sortColumnAction: ({ columnKey, sortColumnAction }) => () => sortColumnAction(columnKey)
})
  (({ columnKey, label, sortField, sortOrder, sortColumnAction }) => (
    <th
      onClick={sortColumnAction}
    >
      <i
        className={classnames({
          'collecticon-sort-none': sortField !== columnKey,
          'collecticon-sort-asc': sortField === columnKey && sortOrder === 'asc',
          'collecticon-sort-desc': sortField === columnKey && sortOrder === 'desc'
        })}
      />
      <T>{label}</T>
    </th>
  ));


const TableRow = withHandlers({
  propertiesButtonClick: ({ vpromm, toggleProperties }) => () => toggleProperties(vpromm),
  deleteRoadHandler: ({ vpromm, deleteRoad }) => () => deleteRoad(vpromm),
  editRoadHandler: ({ vpromm, editRoad }) => () => editRoad(vpromm)
})
  (({
    vpromm, fieldRoads, adminRoadProperties, adminRoadPropertiesFetched,
    vprommFieldInDB, expandedId, language,
    propertiesButtonClick, deleteRoadHandler, editRoadHandler
  }) => {
    // TODO - properly render props dropdown
    const roadPropDropDown = [];

    if (adminRoadPropertiesFetched) {
      if (adminRoadProperties.length !== 0) {
        const adminProp = adminRoadProperties.find((prop) => prop.id === vpromm);
        if (adminProp) {
          _.forEach(adminProp.properties, (prop, key, j) => {
            roadPropDropDown.push(<dt key={`${vpromm}-${key}-${j}-key`}>{key}</dt>);
            roadPropDropDown.push(<dd key={`${vpromm}-${key}-${j}-prop`}>{prop}</dd>);
          });
        } else {
          roadPropDropDown.push(<dt key={`${vpromm}-key`}></dt>);
          roadPropDropDown.push(<dd key={`${vpromm}-prop`}></dd>);
        }
      } else {
        roadPropDropDown.push(<p><T>Loading</T></p>);
      }
    }

    return (
      <tr>
        <td className="table-properties-cell-edit-delete">
          <button
            type="button"
            className="collecticon-trash-bin"
            onClick={deleteRoadHandler}
          />
          <button
            type="button"
            className="collecticon-pencil"
            onClick={editRoadHandler}
          />
        </td>
        <td>
          {vprommFieldInDB ?
            <Link to={`/${language}/explore`}>
              <strong>{vpromm}</strong>
            </Link> :
            vpromm
          }
        </td>
        <td className={vprommFieldInDB ? 'added' : 'not-added'}>
          { vprommFieldInDB &&
            <div className='a-table-actions'>
              <Link
                className='a-table-action'
                to={`/${language}/assets/road/${vpromm}/`}
              >
                <T>Explore</T>
              </Link>
              <a
                className='a-table-action'
                href={`${api}/field/geometries/${vpromm}?grouped=false&download=true`}
              >
                <T>Download</T>
              </a>
            </div>
          }
        </td>
        {
          adminRoadProperties.length !== 0 ?
            <td className='table-properties-cell'>
              <button
                type='button'
                className={`button-table-expand ${expandedId === vpromm ? 'button-table-expand--show' : 'button-table-expand--hide'}`}
                onClick={propertiesButtonClick}
              >
                <span>{expandedId === vpromm ? <T>Hide</T> : <T>Show</T>}</span>
              </button>
              <div
                className={`table-properties ${expandedId !== vpromm ? 'table-properties--hidden' : ''}`}
              >
                <dl className='table-properties-list'>{roadPropDropDown}</dl>
              </div>
            </td> :
            <td/>
        }
      </tr>
    );
  });


const AATable = ({
  adminRoadProperties, data, fieldRoads, adminRoadPropertiesFetched, language,
  expandedId, sortField, sortOrder,
  sortColumnAction, toggleShowProperties, editRoad, deleteRoad
}) => (
  <div className='table'>
    <table>
      <thead>
        <tr>
          <th className="table-properties-head button-column" />
          <TableColumnHeader
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
            <TableRow
              key={vpromm}
              vpromm={vpromm}
              fieldRoads={fieldRoads}
              adminRoadProperties={adminRoadProperties}
              adminRoadPropertiesFetched={adminRoadPropertiesFetched}
              vprommFieldInDB={fieldRoads.includes(vpromm)}
              expandedId={expandedId}
              language={language}
              toggleProperties={toggleShowProperties}
              editRoad={editRoad}
              deleteRoad={deleteRoad}
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
    { sortField: 'id', sortOrder: 'asc', expandedId: null },
    {
      sortColumnAction: ({ sortField, sortOrder }) => (field) => (
        sortField === field ?
          { sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' } :
          { sortField: field, sortOrder: 'asc' }
      ),
      toggleShowProperties: ({ expandedId }) => (vpromm) =>
        ({ expandedId: expandedId === vpromm ? null : vpromm }),
      editRoad: () => (vpromm) => console.log('edit', vpromm),
      deleteRoad: () => (vpromm) => console.log('delete', vpromm)
    }
  )
)(AATable);
