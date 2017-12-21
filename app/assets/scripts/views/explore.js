'use strict';

import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  getContext
} from 'recompose';
import mapboxgl from 'mapbox-gl';
import T from '../components/t';
import config from '../config';
import lineColors from '../utils/line-colors';
import {
  selectExploreMapLayer,
  exploreMapShowNoVpromms,
  setGlobalZoom,
  removeVProMMsBBox
} from '../actions/action-creators';
import MapSearch from '../components/map-search';
import MapOptions from '../components/map-options';
import MapLegend from '../components/map-legend';


var Explore = React.createClass({
  displayName: 'Explore',

  propTypes: {
    _removeVProMMsBBox: React.PropTypes.func,
    _setGlobalZoom: React.PropTypes.func,
    layer: React.PropTypes.string,
    showNoVpromms: React.PropTypes.bool,
    dispatch: React.PropTypes.func,
    globX: React.PropTypes.number,
    globY: React.PropTypes.number,
    globZ: React.PropTypes.number,
    adminBbox: React.PropTypes.array,
    vprommsBbox: React.PropTypes.array,
    location: React.PropTypes.object
  },

  componentDidMount: function () {
    mapboxgl.accessToken = config.mbToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false,
      center: [this.props.globX, this.props.globY],
      zoom: this.props.globZ
    }).addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    this.map.on('load', () => {
      // Load all roads with VPRoMMS values, and color by IRI
      this.map.addLayer({
        id: 'conflated',
        type: 'line',
        source: {
          type: 'vector',
          url: 'mapbox://openroads.vietnam-conflated'
        },
        'source-layer': 'conflated',
        paint: { 'line-width': 4 },
        layout: { 'line-cap': 'round' }
      }).setPaintProperty(
        'conflated',
        'line-color',
        lineColors['iri']
      );
    });
  },

  makeXYZ: function () {
    const xyz = this.map.getCenter();
    xyz.zoom = this.map.getZoom();
    return xyz;
  },

  handleLayerChange: function (e) {
    const property = e.target.value;
    // TODO - don't pass dispatch to component
    this.props.dispatch(selectExploreMapLayer(property));
    this.map.setPaintProperty(
      'conflated',
      'line-color',
      lineColors[property]
    );
  },

  handleShowNoVpromms: function (e) {
    const show = e.target.checked;

    // TODO - don't pass dispatch to component
    this.props.dispatch(exploreMapShowNoVpromms(show));
    if (show) {
      this.map.setFilter('conflated', null);
    } else {
      this.map.setFilter('conflated', ['has', 'or_vpromms']);
    }
  },

  componentWillUnmount: function () {
    this.props._setGlobalZoom(this.makeXYZ());
  },

  componentWillReceiveProps: function (nextProps) {
    let bounds;
    if (nextProps.adminBbox !== this.props.adminBbox) {
      bounds = nextProps.adminBbox;
      if (!bounds.includes(null)) { return this.map.fitBounds(bounds); }
    }
    if (nextProps.vprommsBbox !== this.props.vprommsBbox) {
      bounds = nextProps.vprommsBbox;
      if (!bounds.includes(null)) { return this.map.fitBounds(bounds); }
    }
  },

  render: function () {
    return (
      <section className='inpage inpage--alt'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><T>Explore</T></h1>
            </div>
            <div className='inpage__actions'>
              <MapSearch />
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <figure className='map'>
              <div className='map__media' id='map'></div>
              <div className='map__controls map__controls--top-right'>
                <MapOptions
                  handleLayerChange={ this.handleLayerChange }
                  handleShowNoVpromms={ this.handleShowNoVpromms }
                />
              </div>
              <div className='map__controls map__controls--bottom-right'>
                <MapLegend
                  layer={this.props.layer}
                />
              </div>
            </figure>
          </div>
        </div>
      </section>
    );
  }
});


export default compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    state => ({
      layer: state.exploreMap.layer,
      globX: state.globZoom.x,
      globY: state.globZoom.y,
      globZ: state.globZoom.z,
      vprommsBbox: state.VProMMsWayBbox.bbox,
      adminBbox: state.adminBbox.bbox
    }),
    dispatch => ({
      dispatch,
      _removeVProMMsBBox: function () { dispatch(removeVProMMsBBox()); },
      _setGlobalZoom: function (xyzObj) { dispatch(setGlobalZoom(xyzObj)); }
    })
  )
)(Explore);
