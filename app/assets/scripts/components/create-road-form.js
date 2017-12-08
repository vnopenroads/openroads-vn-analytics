import React from 'react';
import {
  connect
} from 'react-redux';
import {
  compose,
  withStateHandlers
} from 'recompose';
import T, {
  translate
} from './t';


const roadIdIsInValid = (id) => {
  return !/^\d{3}([A-ZĐ]{2}|00)\d{5}$/.test(id);
};

const CreateRoadForm = ({
  language, shouldShowForm, newRoadId, formIsInvalid,
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
          <input
            type="text"
            value={newRoadId}
            placeholder={translate(language, 'New Road Id')}
            onChange={updateNewRoadId}
          />
          <button
            className="button button--secondary-raised-dark"
            onClick={submitForm}
            disabled={newRoadId === ''}
          >
            <T>Submit</T>
          </button>
          <button
            className="button button--base-raised-light"
            onClick={hideForm}
          >
            <T>Cancel</T>
          </button>
        </form>
        {
          formIsInvalid &&
            <p className="invalid"><strong><T>Invalid Road Id</T></strong></p>
        }
      </div> :
      <button
        type="button"
        className="button create-new-road"
        onClick={showForm}
      >
        <i
          className="collecticon-sm-plus"
        />
        <T>Create New Road</T>
      </button>
    }
  </div>
);


export default compose(
  connect(
    state => ({}),
    dispatch => ({
      createRoad: (id) => console.log('create new road', id)
    })
  ),
  withStateHandlers(
    { shouldShowForm: false, newRoadId: '', formIsInvalid: false },
    {
      showForm: () => () => ({ shouldShowForm: true }),
      hideForm: () => (e) => {
        e.preventDefault();
        return { shouldShowForm: false, roadIdIsInValid: false };
      },
      updateNewRoadId: () => (e) => ({ newRoadId: e.target.value }),
      submitForm: ({ newRoadId }, { createRoad }) => (e) => {
        e.preventDefault();

        // TODO - expose validation error messages
        if (roadIdIsInValid(newRoadId)) {
          return { formIsInvalid: true };
        }

        createRoad(newRoadId);
        return { formIsInvalid: false };
      }
    }
  )
)(CreateRoadForm);
