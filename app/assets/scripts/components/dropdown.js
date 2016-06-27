'use strict';
import React from 'react';

const Dropdown = React.createClass({
  displayName: 'Dropdown',

  propTypes: {
    className: React.PropTypes.string,
    triggerTitle: React.PropTypes.string,
    triggerClassName: React.PropTypes.string,
    triggerText: React.PropTypes.string,
    closeDropdown: React.PropTypes.func,
    evtClick: React.PropTypes.bool,
    evtOverOut: React.PropTypes.bool,
    children: React.PropTypes.node
  },

  _bodyListener: function (e) {
    // Get the dropdown that is a parent of the clicked element. If any.
    let theSelf = e.target;
    if (theSelf.tagName === 'BODY' ||
        theSelf.tagName === 'HTML' ||
        e.target.getAttribute('data-hook') === 'dropdown:close') {
      this.setState({open: false});
      return;
    }

    do {
      if (theSelf && theSelf.getAttribute('data-hook') === 'dropdown') {
        break;
      }
      theSelf = theSelf.parentNode;
    } while (theSelf && theSelf.tagName !== 'BODY' && theSelf.tagName !== 'HTML');

    if (theSelf !== this.refs.dropdown) {
      this.setState({open: false});
    }
  },

  getDefaultProps: function () {
    return {
      element: 'div',
      className: '',

      triggerTitle: '',
      triggerClassName: '',
      triggerText: '',

      evtClick: true,
      evtOverOut: true
    };
  },

  getInitialState: function () {
    return {
      open: false
    };
  },

  // Lifecycle method.
  // Called once as soon as the component has a DOM representation.
  componentDidMount: function () {
    window.addEventListener('click', this._bodyListener);
  },

  // Lifecycle method.
  // Called once as soon as the component has a DOM representation.
  componentWillUnmount: function () {
    window.removeEventListener('click', this._bodyListener);
  },

  _toggleDropdown: function (e) {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  },

  _onTriggerClick: function (e) {
    e.preventDefault();
    if (this.props.evtClick) {
      this._toggleDropdown(e);
    }
  },

  render: function () {
    var klasses = ['drop'];
    if (this.state.open) {
      klasses.push('open');
    }
    if (this.props.className) {
      klasses.push(this.props.className);
    }

    let events = {
      onClick: this._onTriggerClick,
      onMouseOver: this._toggleDropdown,
      onMouseOut: this._toggleDropdown
    };

    if (!this.props.evtOverOut) {
      delete events.onMouseOver;
      delete events.onMouseOut;
    }

    return (
      <this.props.element className={klasses.join(' ')} data-hook='dropdown' ref='dropdown'>
        <a href='#' title={this.props.triggerTitle} className={this.props.triggerClassName} {...events}><span>{this.props.triggerText}</span></a>
        <div className='drop-content popover-behavior'>
          {this.props.children}
        </div>
      </this.props.element>
    );
  }
});

module.exports = Dropdown;
