import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  compose,
  withProps,
  getContext
} from 'recompose';
import mapboxgl from 'mapbox-gl';
import _ from 'lodash';
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
import MapOptions from '../components/map-options';
import MapLegend from '../components/map-legend';
import SitePage from '../components/site-page';
import CbaTable from './cba/table'
import SectionDetails from './cba/sidebar'
import { withRouter } from 'react-router';


class CBA extends React.Component {


  componentDidMount() {
    mapboxgl.accessToken = config.mbToken;

    const { lng, lat, zoom, activeRoad, language } = this.props;
    console.log(lng + "," + lat + "," + language);
    if (activeRoad) {
      this.props.fetchActiveRoad(activeRoad);
    }

    this.map = new mapboxgl.Map({
      container: 'cba_map',
      style: 'mapbox://styles/mapbox/satellite-v9',
      failIfMajorPerformanceCaveat: false,
      center: [lng, lat],
      zoom: zoom >= 15 ? 13 : zoom
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Disable map rotation using right click + drag.
    this.map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture.
    this.map.touchZoomRotate.disableRotation();

    // Remove compass.
    document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass').remove();

    this.map.on('load', () => {
      this.map.addSource("conflated-map", {
        type: "vector",
        tiles: ["http://orma.drvn.gov.vn/vertor-tiles/{z}/{x}/{y}.vector.pbf"],
        minzoom: 6,
        maxzoom: 14,
      });
      // Load all roads with VPRoMMS values, and color by IRI
      this.map
        // .addLayer({
        //   id: 'national-roads',
        //   type: 'line',
        //   source: {
        //     type: 'vector',
        //     url: 'mapbox://mapbox.mapbox-streets-v8'
        //   },
        //   'source-layer': 'road',
        //   paint: {
        //     'line-width': [
        //       'interpolate', ['linear'], ['zoom'],
        //       0, 1,
        //       10, 2
        //     ]
        //   },
        //   layout: { 'line-cap': 'round' },
        //   maxzoom: 11
        // })
        .addLayer({
          id: 'active_road',
          type: 'line',
          source: 'conflated-map',
          'source-layer': 'conflated',
          paint: {
            'line-width': 20,
            'line-color': '#D3D3D3'
          },
          layout: { 'line-cap': 'round' },
          filter: ['==', 'vpromm_id', activeRoad]
        })
        .addLayer({
          id: 'novpromm',
          type: 'line',
          source: "conflated-map",
          'source-layer': 'conflated',
          paint: {
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              0, 1,
              10, 2
            ]
          },
          layout: { 'line-cap': 'round' },
          filter: ['!has', 'vpromm_id'],
          maxzoom: 11
        })
        .addLayer({
          id: 'novpromm_dashed',
          type: 'line',
          source: "conflated-map",
          'source-layer': 'conflated',
          paint: {
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              0, 1,
              10, 2
            ],
            'line-dasharray': [1, 2, 1]
          },
          layout: { 'line-cap': 'round' },
          filter: ['!has', 'vpromm_id'],
          minzoom: 10
        })
        .addLayer({
          id: 'vpromm',
          type: 'line',
          source: "conflated-map",
          'source-layer': 'conflated',
          paint: {
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              0, 1,
              10, 2
            ]
          },
          layout: {
            'line-cap': 'round'
          },
          filter: ['has', 'vpromm_id']
        })
        .addLayer({
          id: 'vpromm-label',
          type: 'symbol',
          source: "conflated-map",
          'source-layer': 'conflated',
          layout: {
            'symbol-placement': 'line',
            'text-anchor': 'top',
            'text-field': ['get', 'vpromm_id'],
            'text-font': ['DIN Offc Pro Regular', 'Open Sans Semibold'],
            'text-size': 10
          }
        })
        .addLayer({
          id: 'vpromm-interaction',
          type: 'line',
          source: "conflated-map",
          'source-layer': 'conflated',
          paint: {
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              0, 3,
              10, 8
            ],
            'line-opacity': 0
          },
          layout: { 'line-cap': 'round' },
          filter: ['has', 'vpromm_id']
        })
        .setPaintProperty(
          'novpromm',
          'line-color',
          lineColors['iri_mean']
        )
        .setPaintProperty(
          'novpromm_dashed',
          'line-color',
          lineColors['iri_mean']
        )
        .setPaintProperty(
          'vpromm',
          'line-color',
          lineColors['iri_mean']
        );

      this.map.on('mousemove', (e) => {
        const features = this.map.queryRenderedFeatures(e.point, { layers: ['vpromm-interaction'] });
        this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      });

      this.map.on('click', 'vpromm-interaction', (e) => {
        const vpromm = _.get(e, 'features[0].properties.vpromm_id', null);
        if (vpromm) {
          this.props.router.push(`/${language}/assets/road/${vpromm}`);
        }
      });
    });
  }

  switchLayerTo(layer) {
    this.map.setPaintProperty(
      'novpromm',
      'line-color',
      lineColors[layer]
    )
      .setPaintProperty(
        'novpromm_dashed',
        'line-color',
        lineColors[layer]
      )
      .setPaintProperty(
        'vpromm',
        'line-color',
        lineColors[layer]
      );
  }

  componentWillReceiveProps({ layer, lng, lat, zoom, activeRoad }) {
    if (this.props.layer !== layer) {
      this.switchLayerTo(layer);
    }
    if (lng !== this.props.lng || lat !== this.props.lat || zoom !== this.props.zoom) {
      this.map.flyTo({ center: [lng, lat], zoom });
    }
    if (activeRoad !== this.props.activeRoad) {
      this.map.setFilter('active_road', ['==', 'vpromm_id', activeRoad]);
      this.props.fetchActiveRoad(activeRoad);
    }
  }

  componentWillUnmount() {
    const { lng, lat } = this.map.getCenter();
    const zoom = this.map.getZoom();
    this.props.setMapPosition(lng, lat, zoom);
  }

  handleLayerChange({ target: { value } }) {
    this.props.selectExploreMapLayer(value);
    this.map.setPaintProperty(
      'vpromm',
      'line-color',
      lineColors[value]
    );
  }

  handleShowNoVpromms({ target: { checked } }) {
    this.props.exploreMapShowNoVpromms(checked);

    if (checked) {
      this.map.setLayoutProperty('novpromm', 'visibility', 'visible');
      this.map.setLayoutProperty('novpromm_dashed', 'visibility', 'visible');
    } else {
      this.map.setLayoutProperty('novpromm', 'visibility', 'none');
      this.map.setLayoutProperty('novpromm_dashed', 'visibility', 'none');
    }
  }

  renderInnerPage() {
    return (
      <div className='cba_container'>
        <div className='cba_inner'>
          <div className='cba_map debug' >
            <div className='map__media' id="cba_map" />
          </div>
          <div className='cba_sidebar debug'><SectionDetails rowId={this.props.rowId} /></div>
        </div>
        <div className='cba_table debug'>
          <CbaTable />
        </div>
      </div>
    );
  }

  renderInnerPage2() {
    return (
      <figure className='cba_map'>
        <div className='map__media'></div>
        <MapOptions layer={this.props.layer}
          handleLayerChange={this.handleLayerChange}
          handleShowNoVpromms={this.handleShowNoVpromms} />
        <MapLegend layer={this.props.layer} />
      </figure>
    );
  }

  render() {
    var subPageNav = ["Results", "Config"];
    const { language } = this.props;
    return (<SitePage pageName="CBA" innerPage={this.renderInnerPage()} noMargins={true} subPageNav={subPageNav} language={language} />);
  }
};

CBA.propTypes = {
  layer: PropTypes.string,
  activeRoad: PropTypes.string,
  lng: PropTypes.number,
  lat: PropTypes.number,
  zoom: PropTypes.number,
  rowId: PropTypes.number,
  selectExploreMapLayer: PropTypes.func,
  exploreMapShowNoVpromms: PropTypes.func,
  setMapPosition: PropTypes.func,
  fetchActiveRoad: PropTypes.func
};

export default compose(
  withRouter,
  withProps(({ location: { query: { activeRoad = '' } } }) => ({ activeRoad })),
  getContext({ language: PropTypes.string }),
  connect(
    state => ({
      layer: state.exploreMap.layer,
      lng: state.map.lng,
      lat: state.map.lat,
      zoom: state.map.zoom,
      rowId: 1
    }),
    (dispatch, { activeRoad }) => ({
      setMapPosition: (lng, lat, zoom) => dispatch(setMapPosition(lng, lat, zoom)),
      selectExploreMapLayer: (value) => dispatch(selectExploreMapLayer(value)),
      exploreMapShowNoVpromms: (checked) => dispatch(exploreMapShowNoVpromms(checked)),
      fetchActiveRoad: (activeRoad) => dispatch(fetchRoadBboxEpic(activeRoad))
    })
  )
)(CBA);
