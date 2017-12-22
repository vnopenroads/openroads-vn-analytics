import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  getContext
} from 'recompose';
import MapSearch from '../components/map-search';
import T from '../components/t';
import {
  setMapPosition
} from '../redux/modules/map';
import config from '../config';


var Editor = React.createClass({
  displayName: 'Editor',

  propTypes: {
    setMapPosition: React.PropTypes.func,
    lng: React.PropTypes.number,
    lat: React.PropTypes.number,
    zoom: React.PropTypes.number,
    language: React.PropTypes.string.isRequired
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
          this.hash = e.data.url.replace(new RegExp(`(http:|https:)?${config.editorUrl}/?#?`), '');
          // this.props.dispatch(replace(`/${this.props.language}/editor/${this.hash}`));
          break;
      }
    } else if (e.data.type === 'navigate') {
      switch (e.data.id) {
        case 'or-editor':
          // this.props.dispatch(push(e.data.url));
          break;
      }
    }
  },

  componentDidMount: function () {
    this.hash = '';
    window.addEventListener('message', this.messageListener, false);
  },

  componentWillReceiveProps: function ({ lng, lat, zoom }) {
    if (lng !== this.props.lng || lat !== this.props.lat || zoom !== this.props.zoom) {
      this.map.flyTo({ center: [lng, lat], zoom });
    }
  },

  componentWillUnmount: function () {
    window.removeEventListener('message', this.messageListener, false);

    const mapPositionHash = /[0-9\.]+\/[0-9\.]+\/[0-9\.]+$/.exec(this.hash);
    if (mapPositionHash && mapPositionHash[0] && mapPositionHash[0].split('/').length === 3) {
      const [zoom, lng, lat] = mapPositionHash[0]
        .split('/')
        .map(Number);
      this.props.setMapPosition(lng, lat, zoom);
    }
  },

  render: function () {
    const { lng, lat, zoom } = this.props;

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
              <iframe
                className='map__media'
                src={`${config.editorUrl}#map=${zoom}/${lng}/${lat}`}
                id='main-frame'
                name='main-frame'
                ref="iframe"
              />
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
      lng: state.map.lng,
      lat: state.map.lat,
      zoom: state.map.zoom
    }),
    dispatch => ({
      setMapPosition: (lng, lat, zoom) => dispatch(setMapPosition(lng, lat, zoom))
    })
  )
)(Editor);
