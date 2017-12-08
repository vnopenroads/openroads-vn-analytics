import React from 'react';
import {
  connect
} from 'react-redux';
import {
  compose,
  withStateHandlers
} from 'recompose';
import {
  createRoadEpic
} from '../redux/modules/createRoad';
import {
  roadIdIsInValid
} from '../redux/modules/editRoad';
import T, {
  translate
} from './t';


const CreateRoadForm = ({
  language, shouldShowForm, newRoadId, formIsInvalid, status,
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
        </form>
        {
          formIsInvalid &&
            <p className="invalid"><strong><T>Invalid Road Id</T></strong></p>
        }
        {
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


export default compose(
  connect(
    state => ({
      status: state.createRoad.status
    }),
    dispatch => ({
      createRoad: (id) => dispatch(createRoadEpic(id))
    })
  ),
  withStateHandlers(
    { shouldShowForm: false, newRoadId: '', formIsInvalid: false },
    {
      showForm: () => () => ({ shouldShowForm: true }),
      hideForm: () => (e) => {
        e.preventDefault();
        return { shouldShowForm: false, newRoadId: '', formIsInvalid: false };
      },
      updateNewRoadId: () => (e) => ({ newRoadId: e.target.value }),
      submitForm: ({ newRoadId }, { createRoad }) => (e) => {
        e.preventDefault();

        // TODO - expose validation error messages
        if (roadIdIsInValid(newRoadId)) {
          return { formIsInvalid: true };
        }

        createRoad(newRoadId);
        return { formIsInvalid: false, newRoadId: '' };
      }
    }
  )
)(CreateRoadForm);
