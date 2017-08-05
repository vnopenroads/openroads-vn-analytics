'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';

import { updateGlobalZoom } from '../actions/action-creators';
import config from '../config';

var Editor = React.createClass({
  displayName: 'Editor',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    _updateGlobalZoom: React.PropTypes.func,
    globZoom: React.PropTypes.object
  },

  // /////////////////////////////////////////////////////////////////////////////
  // / Message listener (postMessage)
  // /
  // / When receiving a message form the iframe, process the url and set it.
  // / The url now becomes shareable. The action to take on the url will depend on
  // / the app.
  // /
  // / The switch is done based on the app id, defined when the OR_frame_notifier
  // / is included.
  // /
  // /
  // / What this actually does:
  // / When a the iframe's url changes it is sent via postMessage to the parent. It
  // / removes the base portion on the url (defined in the config) and stores
  // / the rest:
  // / - Url on the "editor" changes to:
  // /     http://devseed.com/editor/#background=something
  // / - Prefix is removed resulting in:
  // /     #background=something
  // / - Appended to the current url:
  // /     http://devseed.com/openroads/#/editor/background=something
  // / - When entering the page, everything after (/#/editor/)
  // /   is sent to the iframe alongside the proper prefix.
  // /
  messageListener: function (e) {
    if (e.data.type === 'urlchange') {
      switch (e.data.id) {
        case 'or-editor':
          var hash = this.cleanUrl(e.data.url, config.editorUrl);
          this.props.dispatch(replace(`/editor/${hash}`));
          this.props._updateGlobalZoom(hash);
          break;
      }
    } else if (e.data.type === 'navigate') {
      switch (e.data.id) {
        case 'or-editor':
          this.props.dispatch(push(e.data.url));
          break;
      }
    }
  },

  cleanUrl: function (url, base) {
    return url.replace(new RegExp(`(http:|https:)?${base}/?#?`), '');
  },

  componentDidMount: function () {
    window.addEventListener('message', this.messageListener, false);
  },

  componentWillUnmount: function () {
    window.removeEventListener('message', this.messageListener, false);
  },

  shouldComponentUpdate: function () {
    return false;
  },

  render: function () {
    var globZoomHash = 'map=' + this.props.globZoom.data.z + '/' + this.props.globZoom.data.x + '/' + this.props.globZoom.data.y;
    var path = config.editorUrl + `#${globZoomHash}`;
    return (
       <iframe src={path} id='main-frame' name='main-frame'></iframe>
    );
  }
});

function selector (state) {
  return {
    globZoom: state.globZoom
  };
}

function dispatcher (dispatch) {
  return {
    dispatch,
    _updateGlobalZoom: (url) => dispatch(updateGlobalZoom(url))
  };
}

module.exports = connect(selector, dispatcher)(Editor);
