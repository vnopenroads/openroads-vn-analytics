import React from 'react';
import T, {
  translate
} from './t';


const RowProperty = ({
  propertyKey, propertyValue, editPropertyValue, status, viewState, language, edited,
  showEditHandler, showReadHandler, showDeleteHandler, inputKeyDown, updateEditValue,
  submitEditHandler, confirmDeleteHandler
}) => (
  viewState === 'read' ?
    <tr
      className={`table-properties-row ${status}`}
    >
      <td
        className="property-key"
      >
        <button
          type="button"
          className="button collecticon-sm-xmark delete-propery"
          title={translate(language, 'Delete')}
          disabled={status !== 'complete'}
          onClick={showDeleteHandler}
        />
        {propertyKey}
      </td>
      <td
        className="property-value"
        onClick={showEditHandler}
      >
        <div>
          {propertyValue}
          {
            edited && <i className="property-edited collecticon-sm-tick"/>
          }
        </div>
      </td>
    </tr> :
    viewState === 'edit' ?
      <tr
        className={`table-properties-row ${status}`}
      >
        <td
          className="property-key"
        >
          <button
            type="button"
            className="button collecticon-sm-xmark delete-propery"
            title={translate(language, 'Delete')}
            disabled={status !== 'complete'}
            onClick={showDeleteHandler}
          />
          {propertyKey}
        </td>
        <td
          className="property-value"
        >
          {
            status === 'error' ?
              <strong className="error-message"><T>Error</T></strong> :
              <form
                className="property-value-input"
                onSubmit={submitEditHandler}
                onBlur={showReadHandler}
              >
                <fieldset disabled={status === 'pending'}>
                  <input
                    type="text"
                    value={editPropertyValue}
                    onChange={updateEditValue}
                    onKeyDown={inputKeyDown}
                    ref={node => node && node.focus()}
                  />
                </fieldset>
              </form>
          }
        </td>
      </tr> :
      viewState === 'delete' ?
        <tr
          className={`table-properties-row ${status}`}
        >
          <td
            className="property-key"
            colSpan="2"
          >
            {
              status === 'error' ?
                <strong className="error-message"><T>Error</T></strong> :
                <div
                  className="confirm-delete"
                >
                  <T>Confirm Delete</T>
                  <button
                    className="button button--secondary-raised-dark"
                    onClick={confirmDeleteHandler}
                    disabled={status === 'pending'}
                  >
                    <T>Delete</T>
                  </button>
                  <button
                    className="button button--base-raised-light"
                    onClick={showReadHandler}
                    disabled={status === 'pending'}
                  >
                    <T>Cancel</T>
                  </button>
                </div>
            }
          </td>
        </tr> :
        <tr/>
);


export default RowProperty;
