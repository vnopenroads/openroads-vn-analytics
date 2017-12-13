import React from 'react';
import T, {
  translate
} from './t';


const CreateRoadForm = ({
  language, shouldShowForm, newRoadId, formIsInvalid, status, error,
  showForm, hideForm, updateNewRoadId, submitForm
}) => (
  <div className='a-main__create-row'>
    {shouldShowForm ?
      <div className='a-main__create-row-form'>
        <h2><T>Create New Road</T></h2>
        <form
          id="create-new-road"
          onSubmit={submitForm}
        >
          <fieldset disabled={status === 'pending'}>
            <input
              type="text"
              value={newRoadId}
              placeholder={translate(language, 'New Road Id')}
              onChange={updateNewRoadId}
            />
            <button
              className="button button--secondary-raised-dark"
              onClick={submitForm}
              disabled={newRoadId === '' || status === 'pending'}
            >
              <T>Submit</T>
            </button>
            <button
              className="button button--base-raised-light"
              onClick={hideForm}
            >
              <T>Cancel</T>
            </button>
            {
              status === 'pending' && <em><T>Loading</T></em>
            }
          </fieldset>
        </form>
        {
          formIsInvalid &&
            <p className="invalid"><strong><T>Invalid Road Id</T></strong></p>
        }
        {
          status === 'error' && error === '409' ?
            <p className="invalid"><strong><T>Error</T></strong>: <T>Road</T> {newRoadId} <T>Already Exists</T></p> :
          status === 'error' && error === 'Failed to fetch' ?
            <p className="invalid"><strong><T>Error</T></strong>: <T>Connection Error</T></p> :
          status === 'error' &&
            <p className="invalid"><strong><T>Error</T></strong></p>
        }
      </div> :
      <button
        type="button"
        className="button create-new-road"
        onClick={showForm}
      >
        <i className="collecticon-sm-plus"/>
        <T>Create New Road</T>
      </button>
    }
  </div>
);


export default CreateRoadForm;
