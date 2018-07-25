'use strict';
import React, { PropTypes } from 'react';
import c from 'classnames';
import { clone, findIndex } from 'lodash';

import { Modal, ModalHeader, ModalBody, ModalFooter } from './modal';

import { environment } from '../config';

let idCounter = 0;
const uniqueId = key => `${key}-${++idCounter}`;

class AssetsEditModal extends React.Component {
  constructor (props) {
    super(props);

    this.addProperty = this.addProperty.bind(this);
    this.renderProperties = this.renderProperties.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);

    this.state = this.prepareState(props);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.roadPropsOp.processing && !nextProps.roadPropsOp.processing) {
      if (!nextProps.roadPropsOp.error) {
        this.props.onCloseClick(true);
      } else {
        alert('An error occurred while saving. Please try again.');
      }
    }

    if (!this.props.revealed && nextProps.revealed) {
      this.setState(this.prepareState(nextProps));
    }
  }

  prepareState (props) {
    const roadProperties = props.roadProps.data.properties;
    const propertyNames = Object.keys(roadProperties);

    return {
      properties: propertyNames.map(p => ({
        id: uniqueId('property'),
        key: p,
        value: roadProperties[p],
        valueOriginal: roadProperties[p],
        existing: true
      })).concat(this.getBaseProperty()),
      propertiesToRemove: []
    };
  }

  getBaseProperty () {
    return {
      id: uniqueId('property'),
      key: '',
      value: '',
      existing: false
    };
  }

  addProperty () {
    const properties = this.state.properties.concat(this.getBaseProperty());
    this.setState({properties});
  }

  removeProperty (id) {
    const field = this.state.properties.find(o => o.id === id);
    const properties = this.state.properties.filter(o => o.id !== id);
    let propertiesToRemove = this.state.propertiesToRemove;
    // Only properties that already should be removed from the DB.
    if (field.existing) {
      propertiesToRemove = propertiesToRemove.concat(field);
    }
    this.setState({properties, propertiesToRemove});
  }

  onPropertyChange (id, what, event) {
    let properties = clone(this.state.properties);
    const idx = findIndex(properties, ['id', id]);

    const val = event.target.value;
    properties[idx][what] = val;

    this.setState({ properties });
  }

  onCloseClick (e) {
    // Block while processing.
    if (this.props.roadPropsOp.processing) return;
    this.props.onCloseClick(true);
  }

  onSave () {
    const propertiesToAdd = this.state.properties.filter(property => !property.existing && property.key !== '');
    const propertiesToUpdate = this.state.properties.filter(property => property.existing && property.value !== property.valueOriginal);
    const propertiesToRemove = this.state.propertiesToRemove;

    console.log('propertiesToAdd', propertiesToAdd);
    console.log('propertiesToUpdate', propertiesToUpdate);
    console.log('propertiesToRemove', propertiesToRemove);

    if (!propertiesToAdd.length && !propertiesToUpdate.length && !propertiesToRemove.length) {
      // Nothing to do. Just close.
      return this.props.onCloseClick(true);
    }

    return this.props.opOnRoadProperty(this.props.vpromm, {
      add: propertiesToAdd,
      replace: propertiesToUpdate,
      remove: propertiesToRemove
    });
  }

  renderProperties ({id, key, value, existing}) {
    const newProperties = this.state.properties.filter(o => !o.existing).length;

    return existing ? (
      <div className='form__group' key={id}>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label' htmlFor={id}>{key}</label>
          </div>
          <div className='form__inner-actions'>
            <button type='button' className='fia-trash' title={'Delete property'} onClick={this.removeProperty.bind(this, id)}><span>Delete</span></button>
          </div>
        </div>
        <input type='text' id={id} name={id} className='form__control' value={value} onChange={this.onPropertyChange.bind(this, id, 'value')} />
      </div>
    ) : (
      <fieldset className='form__fieldset' key={id}>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <legend className='form__legend'>New Property</legend>
          </div>
          <div className='form__inner-actions'>
            <button type='button' className={c('fia-trash', {disabled: newProperties <= 1})} title={'Delete property'} onClick={this.removeProperty.bind(this, id)}><span>Delete</span></button>
          </div>
        </div>

        <div className='form__hascol form__hascol--2'>
          <div className='form__group'>
            <label className='form__label' htmlFor={`key-${id}`}>Name</label>
            <input type='text' id={`key-${id}`} name={`key-${id}`} className='form__control' value={key} onChange={this.onPropertyChange.bind(this, id, 'key')} />
          </div>
          <div className='form__group'>
            <label className='form__label' htmlFor={`value-${id}`}>Value</label>
            <input type='text' id={`value-${id}`} name={`value-${id}`} className='form__control' value={value} onChange={this.onPropertyChange.bind(this, id, 'value')} />
          </div>
        </div>
      </fieldset>
    );
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
            <h1 className='modal__title'>Edit attributes of {this.props.vpromm}</h1>
          </div>
        </ModalHeader>
        <ModalBody>
          <form className={c('form', {disabled: processing})} disabled={processing}>
            <div className='inner'>
              {this.state.properties.map(this.renderProperties)}
              <div className='form__extra-actions'>
                <button type='button' className='fea-plus' title='Add new file' onClick={this.addProperty}><span>New property</span></button>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button className={c('button button--primary-raised-light', {disabled: processing})} disabled={processing} type='button' onClick={this.onCloseClick}><span>Cancel</span></button>
          <button className={c('button button--primary-raised-light', {disabled: processing})} disabled={processing} type='submit' onClick={this.onSave}><span>Save</span></button>
        </ModalFooter>
      </Modal>
    );
  }
}

if (environment !== 'production') {
  AssetsEditModal.propTypes = {
    vpromm: PropTypes.string,
    revealed: PropTypes.bool,
    roadProps: PropTypes.object,
    roadPropsOp: PropTypes.object,
    onCloseClick: PropTypes.func,
    opOnRoadProperty: PropTypes.func
  };
}

export default AssetsEditModal;
