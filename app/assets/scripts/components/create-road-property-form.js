import React from 'react';
import T, {
  translate
} from './t';


const RoadPropertyForm = ({
  language, newPropertyKey, newPropertyValue,
  updateNewPropertyKey, updateNewPropertyValue
}) => (
  <form
    className="create-road-property-form"
  >
    <fieldset disabled={status === 'pending'}>
      <label>
        <h3>
          <T>Create New Property</T>
        </h3>
      </label>
      <input
        className="key-input"
        type="text"
        value={newPropertyKey}
        onChange={updateNewPropertyKey}
        placeholder={translate(language, 'Key')}
      />
      <input
        className="value-input"
        type="text"
        value={newPropertyValue}
        onChange={updateNewPropertyValue}
        placeholder={translate(language, 'Value')}
      />
    </fieldset>
  </form>
);


export default RoadPropertyForm;
