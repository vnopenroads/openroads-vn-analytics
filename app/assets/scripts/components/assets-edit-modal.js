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

    this.addField = this.addField.bind(this);
    this.renderFields = this.renderFields.bind(this);
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
      fields: propertyNames.map(p => ({
        id: uniqueId('property'),
        key: p,
        value: roadProperties[p],
        valueOriginal: roadProperties[p],
        existing: true
      })).concat(this.getBaseField()),
      fieldsToRemove: []
    };
  }

  getBaseField () {
    return {
      id: uniqueId('property'),
      key: '',
      value: '',
      existing: false
    };
  }

  addField () {
    const fields = this.state.fields.concat(this.getBaseField());
    this.setState({fields});
  }

  removeField (id) {
    const field = this.state.fields.find(o => o.id === id);
    const fields = this.state.fields.filter(o => o.id !== id);
    let fieldsToRemove = this.state.fieldsToRemove;
    // Only fields that already should be removed from the DB.
    if (field.existing) {
      fieldsToRemove = fieldsToRemove.concat(field);
    }
    this.setState({fields, fieldsToRemove});
  }

  onFieldChange (id, what, event) {
    let fields = clone(this.state.fields);
    const idx = findIndex(fields, ['id', id]);

    const val = event.target.value;
    fields[idx][what] = val;

    this.setState({ fields });
  }

  onCloseClick (e) {
    // Block while processing.
    if (this.props.roadPropsOp.processing) return;
    this.props.onCloseClick(true);
  }

  onSave () {
    const fieldsToAdd = this.state.fields.filter(field => !field.existing && field.key !== '');
    const fieldsToUpdate = this.state.fields.filter(field => field.existing && field.value !== field.valueOriginal);
    const fieldsToRemove = this.state.fieldsToRemove;

    console.log('fieldsToAdd', fieldsToAdd);
    console.log('fieldsToUpdate', fieldsToUpdate);
    console.log('fieldsToRemove', fieldsToRemove);

    if (!fieldsToAdd.length && !fieldsToUpdate.length && !fieldsToRemove.length) {
      // Nothing to do. Just close.
      return this.props.onCloseClick(true);
    }

    return this.props.opOnRoadProperty(this.props.vpromm, {
      add: fieldsToAdd,
      replace: fieldsToUpdate,
      remove: fieldsToRemove
    });
  }

  renderFields ({id, key, value, existing}) {
    const newFields = this.state.fields.filter(o => !o.existing).length;

    return existing ? (
      <div className='form__group' key={id}>
        <div className='form__inner-header'>
          <label className='form__label' htmlFor={id}>{key}</label>
        </div>
        <div className='form__inner-actions'>
          <button type='button' className='fia-trash' title={'Delete property'} onClick={this.removeField.bind(this, id)}><span>Delete</span></button>
        </div>
        <input type='text' id={id} name={id} className='form__control' value={value} onChange={this.onFieldChange.bind(this, id, 'value')} />
      </div>
    ) : (
      <fieldset className='form__fieldset' key={id}>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <legend className='form__legend'>New Property</legend>
          </div>
          <div className='form__inner-actions'>
            <button type='button' className={c('fia-trash', {disabled: newFields <= 1})} title={'Delete property'} onClick={this.removeField.bind(this, id)}><span>Delete</span></button>
          </div>
        </div>

        <div className='form__hascol form__hascol--2'>
          <div className='form__group'>
            <label className='form__label' htmlFor={`key-${id}`}>Name</label>
            <input type='text' id={`key-${id}`} name={`key-${id}`} className='form__control' value={key} onChange={this.onFieldChange.bind(this, id, 'key')} />
          </div>
          <div className='form__group'>
            <label className='form__label' htmlFor={`value-${id}`}>Value</label>
            <input type='text' id={`value-${id}`} name={`value-${id}`} className='form__control' value={value} onChange={this.onFieldChange.bind(this, id, 'value')} />
          </div>
        </div>
      </fieldset>
    );
  }

  render () {
    return (
      <Modal
        id='assets-edit-modal'
        className='modal--medium'
        onCloseClick={this.onCloseClick}
        revealed={this.props.revealed} >

        <ModalHeader>
          <div className='modal__headline'>
            <h1 className='modal__title'>Edit properties of {this.props.vpromm}</h1>
          </div>
        </ModalHeader>
        <ModalBody>
          <form className={c('form', {disabled: this.props.roadPropsOp.processing})} disabled={this.props.roadPropsOp.processing}>
            <div className='inner'>
              {this.state.fields.map(this.renderFields)}
              <div className='form__extra-actions'>
                <button type='button' className='fea-plus' title='Add new file' onClick={this.addField}><span>New property</span></button>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button className={c('button button--primary-raised-light', {disabled: this.props.roadPropsOp.processing})} disabled={this.props.roadPropsOp.processing} type='button' onClick={this.onCloseClick}><span>Cancel</span></button>
          <button className={c('button button--primary-raised-light', {disabled: this.props.roadPropsOp.processing})} disabled={this.props.roadPropsOp.processing} type='submit' onClick={this.onSave}><span>Save</span></button>
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
