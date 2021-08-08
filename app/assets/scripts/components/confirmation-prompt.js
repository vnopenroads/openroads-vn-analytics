'use strict';
import React from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from './modal';

const noop = () => { };
// Once the component is mounted we store it to be able to access it from
// the outside.
var theConfirmationModal = null;

export default class ConfirmationPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onConfirm: noop,
      onCancel: noop,
      revealed: false,
      title: 'Confirm',
      description: null,
      body: <p>Are you sure</p>
    };
  }

  keyListener(e) {
    // Enter.
    if (this.state.revealed && e.keyCode === 13) {
      e.preventDefault();
      this.onConfirm();
    }
  }

  onConfirm() {
    this.setState({ revealed: false });
    this.state.onConfirm();
  }

  onCancel() {
    this.setState({ revealed: false });
    this.state.onCancel();
  }

  componentDidMount() {
    if (theConfirmationModal !== null) {
      throw new Error('<ConfirmationPrompt /> component was already mounted. Only 1 is allowed.');
    }
    theConfirmationModal = this;
    document.addEventListener('keyup', this.keyListener);
    console.log(this.state)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyListener);
  }

  render() {
    return (
      <Modal
        id='confirmation-prompt'
        className='modal--small modal--prompt'
        onCloseClick={this.onCancel}
        revealed={this.state.revealed} >

        <ModalHeader>
          <div className='modal__headline'>
            <h1 className='modal__title'>{this.state.title}</h1>
            <div className='modal__description'>
              {this.state.description}
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          {this.state.body}
        </ModalBody>
        <ModalFooter>
          <button className='mfa-xmark' type='button' onClick={this.onCancel}><span>Cancel</span></button>
          <button className='mfa-main mfa-tick' type='submit' onClick={this.onConfirm}><span>Confirm</span></button>
        </ModalFooter>
      </Modal>
    );
  }
};

export function showConfirm(opt, onConfirm = noop, onCancel = noop) {
  if (theConfirmationModal === null) {
    throw new Error('<ConfirmationPrompt /> component not mounted');
  }

  theConfirmationModal.setState(Object.assign({}, opt, {
    revealed: true,
    onConfirm,
    onCancel
  }));
}
