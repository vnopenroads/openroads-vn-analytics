'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';
import { CSSTransition } from 'react-transition-group';

export class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.componentAddedBodyClass = false;

    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.keyListener = this.keyListener.bind(this);

    this.el = document.createElement('div');
    this.el.className = `modal-portal-${Math.random().toString()}`;
    this.rootEl = document.querySelector('#site-canvas');
    if (!this.rootEl) throw new Error('Portal root element does not exist.');
  }

  keyListener(e) {
    // ESC.
    if (this.props.revealed && e.keyCode === 27) {
      e.preventDefault();
      this.props.onCloseClick();
    }
  }

  toggleBodyClass(revealed) {
    let bd = document.getElementsByTagName('body')[0];
    if (revealed) {
      this.componentAddedBodyClass = true;
      bd.classList.add('modal__unscrollable-y');
    } else if (this.componentAddedBodyClass) {
      // Only act if the class was added by this component.
      this.componentAddedBodyClass = false;
      bd.classList.remove('modal__unscrollable-y');
    }
  }

  componentDidUpdate() {
    this.toggleBodyClass(this.props.revealed);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.keyListener);
    this.toggleBodyClass(this.props.revealed);

    this.rootEl.appendChild(this.el);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyListener);
    this.toggleBodyClass(false);

    this.rootEl.removeChild(this.el);
  }

  onOverlayClick(e) {
    // Prevent children from triggering this.
    if (e.target === e.currentTarget) {
      // Overlay click is disabled.
      // this.props.onOverlayClick.call(this, e);
    }
  }

  onCloseClick(e) {
    e.preventDefault();
    this.props.onCloseClick(e);
  }

  getChild(klass) {
    let c = null;
    React.Children.forEach(this.props.children, o => {
      if (!c && o.type === klass) {
        c = o;
      }
    });
    return c;
  }

  render() {
    var klasses = ['diy-modal'];
    if (this.props.className) {
      klasses.push(this.props.className);
    }

    return (
      <Portal node={this.el && this.el}>
        <CSSTransition
          in={this.props.revealed}
          appear={true}
          unmountOnExit={true}
          classNames='diy-modal'
          timeout={{ enter: 300, exit: 300 }}>

          <section className={klasses.join(' ')} key={'modal-' + this.props.id} onClick={this.onOverlayClick} id={this.props.id}>
            <div className='modal__inner'>
              {this.getChild(ModalHeader)}
              {this.getChild(ModalBody)}
              {this.getChild(ModalFooter)}
            </div>
            <button className='modal__button-dismiss' title='Close' onClick={this.onCloseClick}><span>Dismiss</span></button>
          </section>

        </CSSTransition>
      </Portal>
    );
  }
}

Modal.defaultProps = {
  revealed: false,

  onOverlayClick: function (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Modal', 'onOverlayClick handler not implemented');
    }
  },

  onCloseClick: function (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Modal', 'onCloseClick handler not implemented');
    }
  }
};

if (process.env.NODE_ENV !== 'production') {
  Modal.propTypes = {
    id: PropTypes.string.isRequired,
    revealed: PropTypes.bool,
    className: PropTypes.string,
    onOverlayClick: PropTypes.func,
    onCloseClick: PropTypes.func,
    children: function (props, propName, componentName) {
      let types = ['ModalHeader', 'ModalBody', 'ModalFooter'];
      let typesRequired = ['ModalHeader', 'ModalBody'];
      let children = React.Children.toArray(props[propName]);

      let c = children.length;
      if (c === 0 || c > 3) {
        return new Error(`${componentName} should have at least a child but no more than 3`);
      }

      let components = {};

      for (let i = 0; i < c; i++) {
        let o = children[i];
        let name = o.type.name;
        if (types.indexOf(name) === -1) {
          return new Error(`${componentName} children should be of the following types: ${types.join(', ')}`);
        }
        if (!components[name]) {
          components[name] = 0;
        }
        if (++components[name] > 1) {
          return new Error(`${componentName} should have only one instance of: ${name}`);
        }
      }

      for (let i = 0; i < typesRequired.length; i++) {
        if (!components[typesRequired[i]]) {
          return new Error(`${componentName} should have a ${typesRequired[i]}`);
        }
      }
    }
  };
}

export class ModalHeader extends React.Component {
  render() {
    return (
      <header className='modal__header'>
        {this.props.children}
      </header>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  ModalHeader.propTypes = {
    children: PropTypes.node
  };
}

export class ModalBody extends React.Component {
  render() {
    return (
      <div className='modal__body'>
        {this.props.children}
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  ModalBody.propTypes = {
    children: PropTypes.node
  };
}

export class ModalFooter extends React.Component {
  render() {
    return (
      <footer className='modal__footer'>
        {this.props.children}
      </footer>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  ModalFooter.propTypes = {
    children: PropTypes.node
  };
}
