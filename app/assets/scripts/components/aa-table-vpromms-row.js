import React from 'react';
import {
  compose,
  withHandlers,
  withStateHandlers
} from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router';
import { api } from '../config';
import T, {
  translate
} from './t';


const TableRow = ({
  vpromm, fieldRoads, adminRoadProperties, adminRoadPropertiesFetched,
  vprommFieldInDB, language, editRoad, newRoadId, expandProperties,
  toggleExpandProperties, deleteRoadHandler, toggleEditRow, updateNewRoadId
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
          title={translate(language, 'Delete Road')}
          onClick={deleteRoadHandler}
        />
        <button
          type="button"
          className="collecticon-pencil"
          title={translate(language, 'Edit Road')}
          onClick={toggleEditRow}
        />
      </td>
      <td>
        {
          editRoad ?
            <input
              type="text"
              value={newRoadId}
            /> :
          vprommFieldInDB ?
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
              className={`button-table-expand ${expandProperties ? 'button-table-expand--show' : 'button-table-expand--hide'}`}
              onClick={toggleExpandProperties}
            >
              <span>{expandProperties ? <T>Hide</T> : <T>Show</T>}</span>
            </button>
            <div
              className={`table-properties ${!expandProperties ? 'table-properties--hidden' : ''}`}
            >
              <dl className='table-properties-list'>{roadPropDropDown}</dl>
            </div>
          </td> :
          <td/>
      }
    </tr>
  );
};


TableRow.propTypes = {

};


export default compose(
  connect(
    null,
    dispatch => ({
      deleteRow: () => () => {},
      editRow: () => () => {}
    })
  ),
  withStateHandlers(
    ({ vpromm }) => ({ editRoad: false, newRoadId: vpromm, expandProperties: false }),
    {
      toggleEditRow: ({ editRoad }) => () => ({ editRoad: !editRoad }),
      toggleExpandProperties: ({ expandProperties }) => () => ({ expandProperties: !expandProperties }),
      updateNewRoadId: () => (e) => ({ newRoadId: e.target.value })
    }
  ),
  withHandlers({
    deleteRoadHandler: () => () => {}
  })
)(TableRow);
