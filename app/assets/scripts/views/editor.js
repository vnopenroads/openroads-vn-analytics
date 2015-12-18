'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';
import config from '../config';

var Editor = React.createClass({
  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  messageListener: function (e) {
    if (e.data.type === 'urlchange') {
      switch (e.data.id) {
        case 'or-editor':
          var hash = this.cleanUrl(e.data.url, config.editorUrl);
          this.props.dispatch(pushPath(`/editor/${hash}`));
          break;
      }
    }
  },

  cleanUrl: function (url, base) {
    return url.replace(new RegExp(`(http:|https:)?${base}#?`), '');
  },

  componentDidMount: function () {
    window.addEventListener('message', this.messageListener, false);
  },

  componentWillUnmount: function () {
    window.removeEventListener('message', this.messageListener, false);
  },

  render: function () {
    var path = config.editorUrl + (this.props.params.splat ? `#${this.props.params.splat}` : '');
    return (
       <iframe src={path} id='main-frame' name='main-frame'></iframe>
    );
  }
});

module.exports = connect()(Editor);
