'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import {
  compose,
  getContext
} from 'recompose';
import { setGlobalZoom } from '../actions/action-creators';
import T from '../components/T';
import {
  transformGeoToPixel,
  pixelDistances,
  newZoomScale,
  makeNewZoom,
  makeCenterpoint,
  makeNWSE
} from '../utils/zoom';
import config from '../config';
import MapSearch from '../components/map-search';

var Editor = React.createClass({
  displayName: 'Editor',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    _setGlobalZoom: React.PropTypes.func,
    globX: React.PropTypes.number,
    globY: React.PropTypes.number,
    globZ: React.PropTypes.number,
    language: React.PropTypes.string.isRequired,
    vprommsBbox: React.PropTypes.array,
    adminBbox: React.PropTypes.array
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
          this.hash = this.cleanUrl(e.data.url, config.editorUrl);
          this.props.dispatch(replace(`/${this.props.language}/editor/${this.hash}`));
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

  makeNewXYZ: function (bounds, zoom) {
    // grab bbox bounds from its returned obj.
    // make NWSE object
    const NWSE = makeNWSE(bounds);
    // make nw and se pixel location objects;
    const nw = transformGeoToPixel(NWSE.nw, zoom);
    const se = transformGeoToPixel(NWSE.se, zoom);
    // pixel distance between nw and se x points & nw and se y points
    const distances = pixelDistances(nw, se);
    // scale factor used to generate new zoom
    const zoomScale = newZoomScale(distances);
    // new zoom, using zoomScale and zoom
    const newZoom = makeNewZoom(zoomScale, zoom);
    // centerpoint for new zoom object
    const cp = makeCenterpoint(bounds);
    // return a zoom object with new x,y, and z!
    return {
      x: cp.x,
      y: cp.y,
      z: newZoom
    };
  },

  makeIdHash: function (newXYZ) {
    return `//editor.openroads-vn.com/#map=${newXYZ.z}/${newXYZ.x}/${newXYZ.y}/`;
  },

  componentDidMount: function () {
    this.hash = '';
    window.addEventListener('message', this.messageListener, false);
  },

  componentWillUnmount: function () {
    window.removeEventListener('message', this.messageListener, false);
    if (this.hash.length) {
      this.props._setGlobalZoom(this.hash);
    }
  },

  componentWillReceiveProps: function (nextProps) {
    // the props this component recieves are only the bounds of either a new admin or vpromms bbox
    // this bbox needs to be converted to a new centerpoint & zoom level.

    // to do this, first grab the current zoom
    const zoom = document.getElementById('main-frame')
      .getAttribute('src')
      .split('#map=')[1].split('/')[0];
    let bounds;
    // then grab a bounding box provided by a user search in the search component
    if (nextProps.vprommsBbox !== this.props.vprommsBbox) {
      bounds = nextProps.vprommsBbox;
    }
    if (nextProps.adminBbox !== this.props.adminBbox) {
      bounds = nextProps.adminBbox;
    }

    if (!bounds) return;

    // then generate a new centerpoint and zoom level with these bounds and zoom level
    const newXYZ = this.makeNewXYZ(bounds, zoom);
    // translate that xyz object into a url hash that when given to the iframe will
    // change the zoom level of iD
    const newiDSource = this.makeIdHash(newXYZ);
    this.hash = this.cleanUrl(newiDSource, config.editorUrl);
    // this.props.dispatch(replace(`/${getLanguage()}/editor/${this.hash}`));
    document.getElementById('main-frame').setAttribute('src', newiDSource);
  },

  render: function () {
    var globalZoomHash = `map=${this.props.globZ.toString()}/${this.props.globX.toString()}/${this.props.globY.toString()}`;
    var path = config.editorUrl + `#${globalZoomHash}`;
    return (
      <section className='inpage inpage--alt'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><T>Editor</T></h1>
            </div>
            <div className='inpage__actions'>
              <MapSearch />
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <figure className='map'>
              <iframe src={path} id='main-frame' name='main-frame' ref="iframe" className='map__media'></iframe>
            </figure>
          </div>
        </div>
      </section>
    );
  }
});


module.exports = compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    state => ({
      globX: state.globZoom.x,
      globY: state.globZoom.y,
      globZ: state.globZoom.z,
      vprommsBbox: state.VProMMsWayBbox.bbox,
      adminBbox: state.adminBbox.bbox
    }),
    dispatch => ({
      dispatch,
      _setGlobalZoom: function (url) { dispatch(setGlobalZoom(url)); }
    })
  )
)(Editor);
