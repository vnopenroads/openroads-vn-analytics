import React from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  getContext
} from 'recompose';
import { connect } from 'react-redux';
import MapSearch from '../components/map-search';
import T from '../components/t';
import config from '../config';

import {
  setMapPosition
} from '../redux/modules/map';

import ORFrameNotifier from '../../../OR_frame_notifier';

class Editor extends React.Component {

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
  messageListener(e) {
    // TODO: This is not working with the new version od ORFrameNotifier
    if (e.data.type === 'urlchange') {
      switch (e.data.id) {
        case 'or-editor':
          this.hash = e.data.url.replace(new RegExp(`(http:|https:)?${config.editorUrl}/?#?`), '');
          // TODO: reconcile how params are surfaced upto the app. don't dispatch anything upto the app for now.
          // this.props.dispatch(replace(`/${this.props.language}/editor/${this.hash}`));
          break;
      }
    } else if (e.data.type === 'navigate') {
      switch (e.data.id) {
        case 'or-editor':
          // TODO: reconcile how params are surfaced upto the app. don't dispatch anything upto the app for now.
          // this.props.dispatch(push(e.data.url));
          break;
      }
    }
  }

  UNSAFE_componentWillReceiveProps({ lng, lat, zoom, way }) {
    // this.props.setMapPosition(lng, lat, zoom, way);
    const mapCenter = [lng, lat];
    if (lng !== this.props.lng || lat !== this.props.lat) {
      this.orFrame.send('setPosition', {
        center: mapCenter,
        zoom
      });
    }
    if (way && way !== this.props.way) {
      setTimeout(() => {
        this.orFrame.send('setPosition', {
          center: mapCenter,
          zoom,
          way
        });
      }, 1000);
    }
  }

  componentDidMount() {
    this.orFrame = new ORFrameNotifier('orma-vn', this.refs.editor.contentWindow);

    this.orFrame.on('loaded', () => {
      const mapPositionHash = /center=([0-9.]+\/[0-9.]+)&?/.exec(this.props.location.search);
      let mapCenter = [108.239, 15.930];
      let zoom = 6;
      if (mapPositionHash && mapPositionHash[1] && mapPositionHash[1].split('/').length === 2) {
        mapCenter = mapPositionHash[1].split('/');
        zoom = 14.5;
      }

      this.orFrame.send('settings', {
        center: mapCenter,
        zoom
      });
    });
  }

  componentWillUnmount() {
    this.orFrame.destroy();
  }

  render() {
    return (
      <section className='inpage inpage--alt'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><T>Editor</T></h1>
            </div>
            <div className='inpage__actions'>
              <MapSearch page="editor" />
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <figure className='map'>
              <iframe
                className='map__media'
                src={`${config.editorUrl}`}
                id='main-frame'
                name='main-frame'
                ref="editor"
              />
            </figure>
          </div>
        </div>
      </section>
    );
  }
};


Editor.propTypes = {
  setMapPosition: PropTypes.func,
  lng: PropTypes.number,
  lat: PropTypes.number,
  zoom: PropTypes.number,
  language: PropTypes.string.isRequired,
  way: PropTypes.string
};



module.exports = compose(
  getContext({ language: PropTypes.string }),
  connect(
    state => ({
      lng: state.map.lng || 108.239,
      lat: state.map.lat || 15.930,
      zoom: state.map.zoom || 6,
      way: state.map.waySlug
    }),
    dispatch => ({
      setMapPosition: (lng, lat, zoom, way) => dispatch(setMapPosition(lng, lat, zoom, way))
    })
  )
)(Editor);
