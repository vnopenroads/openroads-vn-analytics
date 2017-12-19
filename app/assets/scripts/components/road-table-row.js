import React from 'react';
import { Link } from 'react-router';
import { api } from '../config';
import T, {
  translate
} from './t';
import RowProperties from './road-table-row-properties';


const RowReadView = ({
  vpromm, properties, hasOSMData, language, shouldShowProperties,
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
        {hasOSMData ?
          <Link to={`/${language}/explore`}>
            <strong>{vpromm}</strong>
          </Link> :
          vpromm
        }
      </td>

      <td className={hasOSMData ? 'added' : 'not-added'}>
        {hasOSMData &&
          <div className='a-table-actions'>
            <Link
              className='a-table-action'
              to={`/${language}/assets/road/${vpromm}/`}
            >
              <T>Explore</T>
            </Link>
            <a
              className='a-table-action'
              href={`${api}/properties/roads/${vpromm}.geojson`}
              download
            >
              <T>Download</T>
            </a>
          </div>
        }
      </td>

      <td className='table-properties-cell'>
        {
          Object.keys(properties).length !== 0 &&
            <div>
              <button
                type='button'
                className={`button-table-expand ${shouldShowProperties ? 'button-table-expand--show' : 'button-table-expand--hide'}`}
                onClick={toggleProperties}
              >
                <span>{shouldShowProperties ? <T>Hide</T> : <T>Show</T>}</span>
              </button>
              {
                shouldShowProperties &&
                  <RowProperties
                    properties={properties}
                  />
              }
            </div>
        }
      </td>
    </tr>
  );
};

const RowEditView = ({
  vpromm, newRoadId, formIsInvalid, status, error,
  showReadView, updateNewRoadId, confirmEdit
}) => (
  <tr
    className="edit-row"
  >
    <td />
    <td
      colSpan="3"
    >
      <form
        onSubmit={confirmEdit}
      >
        <fieldset disabled={status === 'pending'}>
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
              status === 'pending' && <T>Loading</T>
            }
          </p>
          {
            formIsInvalid && <strong><T>Invalid Road Id</T></strong>
          }
          {
            status === 'error' && error === '409' ?
              <p className="invalid"><strong><T>Error</T></strong>: <T>Road</T> {newRoadId} <T>Already Exists</T></p> :
            status === 'error' && error === 'Failed to fetch' ?
              <p className="invalid"><strong><T>Error</T></strong>: <T>Connection Error</T></p> :
            status === 'error' &&
              <p className="invalid"><strong><T>Error</T></strong></p>
          }
        </fieldset>
      </form>
    </td>
  </tr>
);

const RowDeleteView = ({ vpromm, status, error, showReadView, confirmDelete }) => (
  <tr
    className="delete-row"
  >
    <td/>
    <td
      colSpan="3"
    >
      <p>
        <T>Are you sure you want to delete VPRoMMS</T> <strong>{vpromm}</strong>?
        <button
          className="button button--secondary-raised-dark"
          onClick={confirmDelete}
          disabled={status === 'pending'}
        >
          <T>Delete</T>
        </button>
        <button
          className="button button--base-raised-light"
          onClick={showReadView}
          disabled={status === 'pending'}
        >
          <T>Cancel</T>
        </button>
        {
          status === 'pending' && <T>Loading</T>
        }
      </p>
      {
        status === 'error' && error === 'Failed to fetch' ?
          <p className="invalid"><strong><T>Error</T></strong>: <T>Connection Error</T></p> :
        status === 'error' &&
          <p className="invalid"><strong><T>Error</T></strong></p>
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


export const TableErrorRow = () => (
  <tr
    className="error-row"
  >
    <td/>
    <td
      colSpan="3"
    >
      <p className="invalid"><strong><T>Error</T></strong></p>
    </td>
  </tr>
);


export default TableRow;
