import React from 'react';
import {
  connect
} from 'react-redux';
import {
  withRouter
} from 'react-router';
import {
  compose,
  lifecycle,
  withStateHandlers
} from 'recompose';
import {
  createRoadEpic
} from '../redux/modules/createRoad';
import {
  roadIdIsValid
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
  withRouter,
  connect(
    (state, { router: { params: { aaId, aaIdSub } } }) => ({
      status: state.createRoad.status,
      province: state.crosswalk.province[aaId] && state.crosswalk.province[aaId].id,
      district: state.crosswalk.district[aaIdSub] && state.crosswalk.district[aaIdSub]
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
        e && e.preventDefault();
        return { shouldShowForm: false, newRoadId: '', formIsInvalid: false };
      },
      updateNewRoadId: () => (e) => ({ newRoadId: e.target.value }),
      submitForm: ({ newRoadId }, { province, district, createRoad }) => (e) => {
        e.preventDefault();

        // TODO - expose validation error messages
        if (!roadIdIsValid(newRoadId, province, district)) {
          return { formIsInvalid: true };
        }

        createRoad(newRoadId);
        return { formIsInvalid: false, newRoadId: '' };
      }
    }
  ),
  lifecycle({
    componentWillReceiveProps: function ({ status: nextStatus }) {
      if (this.props.status === 'pending' && nextStatus === 'complete') {
        this.props.hideForm();
      }
    }
  })
)(CreateRoadForm);
