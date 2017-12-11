import React from 'react';
import {
  compose,
  getContext,
  withHandlers
} from 'recompose';
import {
  withRouter
} from 'react-router';
import { connect } from 'react-redux';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
import _ from 'lodash';
import { Link } from 'react-router';
import {
  EDIT_ROAD,
  EDIT_ROAD_SUCCESS,
  EDIT_ROAD_ERROR,
  DELETE_ROAD,
  DELETE_ROAD_SUCCESS,
  DELETE_ROAD_ERROR,
  roadIdIsValid,
  editRoadEpic,
  deleteRoadEpic
} from '../redux/modules/editRoad';
import { api } from '../config';
import T, {
  translate
} from './t';


const RowPropertiesList = ({
  vpromm, adminRoadProperties, shouldShowProperties, toggleProperties
}) => {
  // TODO - properly render props dropdown
  const roadPropDropDown = [];

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
  }

  return adminRoadProperties.length !== 0 ?
    <td className='table-properties-cell'>
      <button
        type='button'
        className={`button-table-expand ${shouldShowProperties ? 'button-table-expand--show' : 'button-table-expand--hide'}`}
        onClick={toggleProperties}
      >
        <span>{shouldShowProperties ? <T>Hide</T> : <T>Show</T>}</span>
      </button>
      <div
        className={`table-properties ${!shouldShowProperties ? 'table-properties--hidden' : ''}`}
      >
        <dl className='table-properties-list'>{roadPropDropDown}</dl>
      </div>
    </td> :
    <td/>;
};

const RowReadView = ({
  vpromm, adminRoadProperties,
  vprommFieldInDB, language, shouldShowProperties,
  toggleProperties, showDeleteView, showEditView
}) => {
  return (
    <tr>
      <td className="table-properties-cell-view-buttons">
        <button
          type="button"
          className="collecticon-trash-bin"
          title={translate(language, 'Delete Road')}
          onClick={showDeleteView}
        />
        <button
          type="button"
          className="collecticon-pencil"
          title={translate(language, 'Edit Road')}
          onClick={showEditView}
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
      <RowPropertiesList
        vpromm={vpromm}
        adminRoadProperties={adminRoadProperties}
        shouldShowProperties={shouldShowProperties}
        toggleProperties={toggleProperties}
      />
    </tr>
  );
};

const RowEditView = ({
  vpromm, newRoadId, formIsInvalid, status, showReadView, updateNewRoadId, confirmEdit
}) => (
  <tr
    className="edit-row"
  >
    <td />
    <td
      colSpan="3"
    >
      {
          <p>
            <input
              type="text"
              value={newRoadId}
              onChange={updateNewRoadId}
            />
            <button
              className="button button--secondary-raised-dark"
              onClick={confirmEdit}
              disabled={newRoadId === '' || status === 'pending' || newRoadId === vpromm}
            >
              <T>Submit</T>
            </button>
            <button
              className="button button--base-raised-light"
              onClick={showReadView}
            >
              <T>Cancel</T>
            </button>
            {
              status === 'pending' ?
                <T>Loading</T> :
              status === 'error' ?
                <T>Error</T> :
              formIsInvalid ?
                <strong><T>Invalid Road Id</T></strong> :
                <span/>
            }
          </p>
      }
    </td>
  </tr>
);

const RowDeleteView = ({ vpromm, status, showReadView, confirmDelete }) => (
  <tr
    className="delete-row"
  >
    <td/>
    <td
      colSpan="3"
    >
      {
        status === 'pending' ?
          <p><T>Loading</T></p> :
        status === 'error' ?
          <p><T>Error</T></p> :
          <p>
            <T>Are you sure you want to delete VPRoMMS</T> <strong>{vpromm}</strong>?
            <button
              className="button button--secondary-raised-dark"
              onClick={confirmDelete}
            >
              <T>Delete</T>
            </button>
            <button
              className="button button--base-raised-light"
              onClick={showReadView}
            >
              <T>Cancel</T>
            </button>
          </p>
      }
    </td>
  </tr>
);

const TableRow = (props) => {
  if (props.viewState === 'read') {
    return <RowReadView {...props} />;
  } else if (props.viewState === 'edit') {
    return <RowEditView {...props} />;
  } else if (props.viewState === 'delete') {
    return <RowDeleteView {...props} />;
  }
};


TableRow.propTypes = {
  viewState: React.PropTypes.string.isRequired
};


const reducer = (
  state = {
    viewState: 'read',
    newRoadId: '',
    shouldShowProperties: false,
    formIsInvalid: false,
    status: 'complete',
    error: false
  },
  action
) => {
  if (action.type === 'SHOW_READ_VIEW') {
    return Object.assign({}, state, {
      viewState: 'read',
      newRoadId: '',
      formIsInvalid: ''
    });
  } else if (action.type === 'SHOW_EDIT_VIEW') {
    return Object.assign({}, state, {
      viewState: 'edit'
    });
  } else if (action.type === 'SHOW_DELETE_VIEW') {
    return Object.assign({}, state, {
      viewState: 'delete'
    });
  } else if (action.type === 'SHOW_PROPERTIES') {
    return Object.assign({}, state, {
      shouldShowProperties: true
    });
  } else if (action.type === 'HIDE_PROPERTIES') {
    return Object.assign({}, state, {
      shouldShowProperties: false
    });
  } else if (action.type === 'UPDATE_NEW_ROAD_ID') {
    return Object.assign({}, state, {
      newRoadId: action.id
    });
  } else if (action.type === 'FORM_IS_INVALID') {
    return Object.assign({}, state, {
      formIsInvalid: true
    });
  } else if (action.type === EDIT_ROAD) {
    return Object.assign({}, state, {
      status: 'pending',
      formIsInvalid: false
    });
  } else if (action.type === EDIT_ROAD_SUCCESS) {
    return Object.assign({}, state, {
      status: 'complete',
      newRoadId: ''
    });
  } else if (action.type === EDIT_ROAD_ERROR) {
    return Object.assign({}, state, {
      status: 'error',
      error: action.error
    });
  } else if (action.type === DELETE_ROAD) {
    return Object.assign({}, state, {
      status: 'pending',
      formIsInvalid: false
    });
  } else if (action.type === DELETE_ROAD_SUCCESS) {
    return Object.assign({}, state, {
      status: 'complete'
    });
  } else if (action.type === DELETE_ROAD_ERROR) {
    return Object.assign({}, state, {
      status: 'error',
      error: action.error
    });
  }

  return state;
};


export default compose(
  getContext({ language: React.PropTypes.string }),
  withRouter,
  connect(
    (state, { vpromm, router: { params: { aaId, aaIdSub } } }) => ({
      province: state.crosswalk.province[aaId] && state.crosswalk.province[aaId].id,
      district: state.crosswalk.district[aaIdSub] && state.crosswalk.district[aaIdSub]
    })
  ),
  local({
    key: ({ vpromm }) => `${vpromm}-table-row`,
    createStore: () => createStore(reducer),
    mapDispatchToProps: (dispatch, { vpromm }) => ({
      showProperties: () => dispatch({ type: 'SHOW_PROPERTIES' }),
      hideProperties: () => dispatch({ type: 'HIDE_PROPERTIES' }),
      showReadView: () => dispatch({ type: 'SHOW_READ_VIEW' }),
      showEditView: () => dispatch({ type: 'SHOW_EDIT_VIEW' }),
      showDeleteView: () => dispatch({ type: 'SHOW_DELETE_VIEW' }),
      updateNewRoadId: ({ target: { value: id } }) => dispatch({ type: 'UPDATE_NEW_ROAD_ID', id }),
      invalidateForm: () => dispatch({ type: 'FORM_IS_INVALID' }),
      confirmDelete: () => dispatch(deleteRoadEpic(vpromm)),
      submitEdit: (newRoadId) => dispatch(editRoadEpic(vpromm, newRoadId))
    }),
    filterGlobalActions: ({ type }) =>
      [EDIT_ROAD, EDIT_ROAD_SUCCESS, EDIT_ROAD_ERROR, DELETE_ROAD, DELETE_ROAD_SUCCESS, DELETE_ROAD_ERROR].indexOf(type) > -1
  }),
  withHandlers({
    toggleProperties: ({ shouldShowProperties, showProperties, hideProperties }) => () =>
      shouldShowProperties ? hideProperties() : showProperties(),
    confirmEdit: ({ newRoadId, province, district, submitEdit, invalidateForm }) => (e) => {
      e.preventDefault();
      // TODO - expose validation error messages
      if (!roadIdIsValid(newRoadId, province, district)) {
        return invalidateForm();
      }

      submitEdit(newRoadId);
    }
  })
)(TableRow);
