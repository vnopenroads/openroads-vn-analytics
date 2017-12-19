import React from 'react';
import T, {
  translate
} from './t';


const RowProperty = ({ propertyKey, propertyValue, status, language, deleteHandler }) => (
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
    >
      {status === 'error' ?
        <strong className="error-message"><T>Error</T></strong> :
        propertyValue
      }
    </td>
  </tr>
);


export default RowProperty;
