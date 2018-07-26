import React from 'react';
import T, {
  translate
} from './t';


const RoadPropertyForm = ({
  status, shouldShowForm, language, newPropertyKey, newPropertyValue,
  updateNewPropertyKey, updateNewPropertyValue, submitForm, showForm, hideForm
}) => (
  <div
    className="create-road-property-form"
  >
    {
      shouldShowForm ?
        <button
          type="button"
          className="button create-new-property"
          onClick={hideForm}
        >
          <i
            className="collecticon-sm-xmark"
          />
          <h3>
            <T>Create New Property</T>
          </h3>
        </button> :
        <button
          type="button"
          className="button create-new-property"
          onClick={showForm}
        >
          <i
            className="collecticon-sm-plus"
          />
          <h3>
            <T>Create New Property</T>
          </h3>
        </button>
    }

    {
      shouldShowForm &&
        <form
          onSubmit={submitForm}
        >
          <fieldset disabled={status === 'pending'}>
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
            <div>
              <button
                className="button button--secondary-raised-dark submit"
                onClick={submitForm}
                disabled={newPropertyKey === '' || newPropertyValue === '' || status === 'pending'}
              >
                <T>Submit</T>
              </button>
              <button
                className="button button--base-raised-light cancel"
                onClick={hideForm}
                disabled={newPropertyKey === '' || newPropertyValue === '' || status === 'pending'}
              >
                <T>Cancel</T>
              </button>
              {
                status === 'pending' &&
                  <em><T>Loading</T></em>
              }
              {
                status === 'error' &&
                  <strong className="error-message"><T>Error</T></strong>
              }
            </div>
          </fieldset>
        </form>
    }
  </div>
);


export default RoadPropertyForm;
