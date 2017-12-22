import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  withProps,
  getContext
} from 'recompose';
import mapboxgl from 'mapbox-gl';
import T from '../components/t';
import config from '../config';
import lineColors from '../utils/line-colors';
import {
  selectExploreMapLayer,
  exploreMapShowNoVpromms
} from '../actions/action-creators';
import {
  setMapPosition
} from '../redux/modules/map';
import {
  fetchRoadBboxEpic
} from '../redux/modules/roads';
import MapSearch from '../components/map-search';
import MapOptions from '../components/map-options';
import MapLegend from '../components/map-legend';
import { withRouter } from 'react-router';


var Explore = React.createClass({
  displayName: 'Explore',

  propTypes: {
    layer: React.PropTypes.string,
    activeRoad: React.PropTypes.string,
    lng: React.PropTypes.number,
    lat: React.PropTypes.number,
    zoom: React.PropTypes.number,
    selectExploreMapLayer: React.PropTypes.func,
    exploreMapShowNoVpromms: React.PropTypes.func,
    setMapPosition: React.PropTypes.func,
    fetchActiveRoad: React.PropTypes.func
  },

  componentDidMount: function () {
    mapboxgl.accessToken = config.mbToken;

    const { lng, lat, zoom, activeRoad } = this.props;

    if (activeRoad) {
      this.props.fetchActiveRoad(activeRoad);
    }

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false,
      center: [lng, lat],
      zoom: zoom
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    this.map.on('load', () => {
      // Load all roads with VPRoMMS values, and color by IRI
      this.map
        .addLayer({
          id: 'active_road',
          type: 'line',
          source: {
            type: 'vector',
            url: 'mapbox://openroads.vietnam-conflated'
          },
          'source-layer': 'conflated',
          paint: {
            'line-width': 8,
            'line-color': '#ff8580' // '#da251d'
          },
          layout: { 'line-cap': 'round' },
          filter: ['==', 'or_vpromms', activeRoad || '']
        })
        .addLayer({
          id: 'conflated',
          type: 'line',
          source: {
            type: 'vector',
            url: 'mapbox://openroads.vietnam-conflated'
          },
          'source-layer': 'conflated',
          paint: { 'line-width': 4 },
          layout: { 'line-cap': 'round' }
        })
        .setPaintProperty(
          'conflated',
          'line-color',
          lineColors['iri']
        );
    });
  },

  componentWillReceiveProps: function ({ lng, lat, zoom, activeRoad }) {
    if (lng !== this.props.lng || lat !== this.props.lat || zoom !== this.props.zoom) {
      this.map.flyTo({ center: [lng, lat], zoom });
    }

    if (activeRoad !== this.props.activeRoad) {
      this.map.setFilter('active_road', ['==', 'or_vpromms', activeRoad]);
      this.props.fetchActiveRoad(activeRoad);
    }
  },

  componentWillUnmount: function () {
    const { lng, lat } = this.map.getCenter();
    const zoom = this.map.getZoom();
    this.props.setMapPosition(lng, lat, zoom);
  },

  handleLayerChange: function ({ target: { value } }) {
    this.props.selectExploreMapLayer(value);
    this.map.setPaintProperty(
      'conflated',
      'line-color',
      lineColors[value]
    );
  },

  handleShowNoVpromms: function ({ target: { checked } }) {
    this.props.exploreMapShowNoVpromms(checked);

    if (checked) {
      this.map.setFilter('conflated', null);
    } else {
      this.map.setFilter('conflated', ['has', 'or_vpromms']);
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
                  handleLayerChange={this.handleLayerChange}
                  handleShowNoVpromms={this.handleShowNoVpromms}
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
  withRouter,
  withProps(({ location: { query: { activeRoad } } }) => ({
    activeRoad
  })),
  getContext({ language: React.PropTypes.string }),
  connect(
    state => ({
      layer: state.exploreMap.layer,
      lng: state.map.lng,
      lat: state.map.lat,
      zoom: state.map.zoom
    }),
    (dispatch, { activeRoad }) => ({
      setMapPosition: (lng, lat, zoom) => dispatch(setMapPosition(lng, lat, zoom)),
      selectExploreMapLayer: (value) => dispatch(selectExploreMapLayer(value)),
      exploreMapShowNoVpromms: (checked) => dispatch(exploreMapShowNoVpromms(checked)),
      fetchActiveRoad: (activeRoad) => dispatch(fetchRoadBboxEpic(activeRoad))
    })
  )
)(Explore);
