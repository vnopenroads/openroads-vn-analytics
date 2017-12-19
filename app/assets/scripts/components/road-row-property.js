import React from 'react';
import T, {
  translate
} from './t';


const RowProperty = ({
  propertyKey, propertyValue, editPropertyValue, status, shouldShowEdit, language,
  showEditHandler, hideEditHandler, inputKeyDown, updateEditValue, submitEditHandler, deleteHandler
}) => (
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
        onClick={deleteHandler}
      />
      {propertyKey}
    </td>
    <td
      className="property-value"
      onClick={showEditHandler}
    >
      {
        status === 'error' ?
          <strong className="error-message"><T>Error</T></strong> :
        shouldShowEdit ?
          <form
            className="property-value-input"
            onSubmit={submitEditHandler}
            onBlur={hideEditHandler}
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
          </form> :
          <div>
            {propertyValue}
          </div>
      }
    </td>
  </tr>
);


export default RowProperty;
