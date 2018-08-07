'use strict';
import React, { PropTypes } from 'react';
import c from 'classnames';
import { connect } from 'react-redux';
import {
  compose,
  getContext
} from 'recompose';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
import { withRouter } from 'react-router';

import {
  CREATE_ROAD,
  CREATE_ROAD_SUCCESS,
  CREATE_ROAD_ERROR,
  createRoadEpic
} from '../redux/modules/roads';
import { environment } from '../config';

import T, {
  translate
} from '../components/t';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './modal';


class AssetsCreateModal extends React.Component {
  constructor (props) {
    super(props);

    this.onSave = this.onSave.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);

    this.state = this.prepareState(props);
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.revealed && nextProps.revealed) {
      this.setState(this.prepareState(nextProps));
    }
  }

  prepareState (props) {
    return {
      vpromm: ''
    };
  }

  onValueChange (what, event) {
    this.setState({ [what]: event.target.value });
  }

  onCloseClick (e) {
    // Block while processing.
    if (this.props.roadPropsOp.processing) return;
    this.props.onCloseClick();
  }

  async onSave (e) {
    e.preventDefault();
    const vpromm = this.state.vpromm;

    // Validate Vprom

    try {
      const res = await this.props.createRoad(vpromm);
      if (res.error) throw new Error(res.error);
      this.props.onCloseClick({action: 'redirect', vpromm});
    } catch (error) {
      alert(translate(this.props.language, 'The Vpromm Id id not valid. Please try again.'));
    }
  }

  render () {
    const { processing } = this.props.roadPropsOp;

    return (
      <Modal
        id='assets-edit-modal'
        className='modal--medium'
        onCloseClick={this.onCloseClick}
        revealed={this.props.revealed} >

        <ModalHeader>
          <div className='modal__headline'>
            <h1 className='modal__title'><T>Add new asset</T></h1>
          </div>
        </ModalHeader>
        <ModalBody>
          <form className={c('form', {disabled: processing})} disabled={processing} onSubmit={this.onSave}>
            <div className='inner'>
              <fieldset className='form__fieldset'>
                <legend className='form__legend'><T>Meta</T></legend>
                <div className='form__group'>
                  <label className='form__label' htmlFor='vpromm'>VPRoMM ID</label>
                  <input type='text' id='vpromm' name='vpromm' className='form__control' value={this.state.vpromm} onChange={this.onValueChange.bind(this, 'vpromm')} />
                </div>
              </fieldset>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button className={c('mfa-xmark', {disabled: processing})} disabled={processing} type='button' onClick={this.onCloseClick}><span>Cancel</span></button>
          <button className={c('mfa-main mfa-tick', {disabled: processing})} disabled={processing} type='submit' onClick={this.onSave}><span>Save</span></button>
        </ModalFooter>
      </Modal>
    );
  }
}

if (environment !== 'production') {
  AssetsCreateModal.propTypes = {
    revealed: PropTypes.bool,
    roadPropsOp: PropTypes.object,
    onCloseClick: PropTypes.func,
    createRoad: PropTypes.func,
    language: PropTypes.string
  };
}


class AssetsCreate extends React.Component {
  constructor (props) {
    super(props);

    this.onCreateAssetClick = this.onCreateAssetClick.bind(this);
    this.onModalClose = this.onModalClose.bind(this);

    this.state = {
      createModalOpen: false
    };
  }

  onModalClose (data = {}) {
    this.setState({ createModalOpen: false });
    if (data.action === 'redirect') {
      // Why the setTimeout you ask?
      // For some reason redux-fractal doesn't play well with thunks.
      // It thinks that the action is being dispatched from a reducer and
      // throws an error. "Reducers may not dispatch actions."
      // This is meant to refresh the data after properties are saved.
      setTimeout(() => { this.props.router.push({pathname: `/${this.props.language}/assets/road/${data.vpromm}/`}); }, 0);
    }
  }

  onCreateAssetClick (e) {
    e.preventDefault();
    this.setState({ createModalOpen: true });
  }

  render () {
    return (
      <div>
        <a href='#' className='ica-plus ica-main' onClick={this.onCreateAssetClick}><T>Add asset</T></a>

        <AssetsCreateModal
          revealed={this.state.createModalOpen}
          language={this.props.language}
          onCloseClick={this.onModalClose}
          createRoad={this.props.createRoad}
          roadPropsOp={this.props.roadPropsOp} />
      </div>
    );
  }
}

if (environment !== 'production') {
  AssetsCreate.propTypes = {
    router: PropTypes.object,
    createRoad: React.PropTypes.func,
    language: React.PropTypes.string,
    roadPropsOp: React.PropTypes.object
  };
}

//
//
//

// Road operations state and reducer.
// Handles operations done to the properties.
const stateOpOnRoad = {
  processing: false,
  data: {}
};

const reducerOpOnRoad = (state = stateOpOnRoad, action) => {
  switch (action.type) {
    case CREATE_ROAD:
      return {...state, processing: true, error: false};
    case CREATE_ROAD_SUCCESS:
      return {...state, processing: false, error: false, data: action.data};
    case CREATE_ROAD_ERROR:
      return {...state, processing: false, error: true};
  }

  return state;
};

export default compose(
  withRouter,
  getContext({ language: React.PropTypes.string }),
  local({
    key: ({ vpromm }) => `create-road`,
    createStore: () => createStore(reducerOpOnRoad),
    mapStateToProps: (state) => ({
      roadPropsOp: state
    }),
    filterGlobalActions: ({ type }) => [
      CREATE_ROAD,
      CREATE_ROAD_SUCCESS,
      CREATE_ROAD_ERROR
    ].indexOf(type) > -1
  }),
  connect(
    (state, props) => ({}),
    (dispatch) => ({
      createRoad: (...args) => dispatch(createRoadEpic(...args))
    })
  )
)(AssetsCreate);
