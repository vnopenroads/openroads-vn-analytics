'use strict';

import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import getExtent from 'turf-extent';
import { t } from '../utils/i18n';
import c from 'classnames';
import intersect from '@turf/line-intersect';

import {
  fetchNextWayTask,
  setGlobalZoom
} from '../actions/action-creators';

const source = 'collisions';
const roadHoverId = 'road-hover';
const roadSelected = 'road-selected';
const layers = [{
  id: 'road',
  type: 'line',
  paint: {
    'line-width': 4,
    'line-opacity': 0.2
  },
  layout: { 'line-cap': 'round' }
}, {
  id: roadHoverId,
  type: 'line',
  paint: {
    'line-width': 6,
    'line-opacity': 0.9
  },
  layout: { 'line-cap': 'round' },
  filter: ['==', '_id', '']
}, {
  id: roadSelected,
  type: 'line',
  paint: {
    'line-width': 6,
    'line-opacity': 0.9,
    'line-color': '#FF0000'
  },
  layout: { 'line-cap': 'round' },
  filter: ['==', '_id', '']
}].map(layer => Object.assign({source}, layer));

const layerIds = layers.map(layer => layer.id);

var Tasks = React.createClass({
  getInitialState: function () {
    return {
      currentTaskId: null,
      skippedTasks: [],
      hoverId: null,
      selectedIds: []
    };
  },

  propTypes: {
    _fetchNextTask: React.PropTypes.func,
    _setGlobalZoom: React.PropTypes.func,

    meta: React.PropTypes.object,
    task: React.PropTypes.object,
    taskId: React.PropTypes.number
  },

  componentWillMount: function () {
    this.fetchNextTask();
  },

  componentDidMount: function () {
    mapboxgl.accessToken = config.mbToken;
    const map = this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    }).addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    this.onMapLoaded(() => {
      let makeXYZ = function () {
        const xyz = map.getCenter();
        xyz.zoom = map.getZoom();
        return xyz;
      };

      map.on('zoom', () => {
        this.props._setGlobalZoom(makeXYZ());
      });

      map.on('moveend', () => {
        this.props._setGlobalZoom(makeXYZ());
      });

      map.on('mousemove', (e) => {
        // toggle cursor and hover filters on mouseover
        let features = map.queryRenderedFeatures(e.point, { layers: layerIds });
        let id;

        if (features.length && features[0].properties._id) {
          map.getCanvas().style.cursor = 'pointer';
          id = features[0].properties._id;
        } else {
          map.getCanvas().style.cursor = '';
          id = '';
        }

        this.setState({hoverId: id});
        this.map.setFilter(roadHoverId, ['==', '_id', id]);
      });

      map.on('click', (e) => {
        let features = map.queryRenderedFeatures(e.point, { layers: [ roadHoverId ] });
        if (features.length && features[0].properties._id) {
          let featId = features[0].properties._id;
          // Clone the selected array.
          let selectedIds = [].concat(this.state.selectedIds);
          let idx = findIndex(selectedIds, o => o === featId);

          if (idx === -1) {
            selectedIds.push(featId);
          } else {
            selectedIds.splice(idx, 1);
          }

          this.map.setFilter(roadSelected, ['in', '_id'].concat(selectedIds));
          this.setState({ selectedIds });
        }
      });
    });
  },

  componentWillReceiveProps: function ({taskId, task}) {
    if (taskId && taskId !== this.state.currentTaskId) {
      // We've queried and received a new task
      this.setState({
        currentTaskId: taskId
      });
      return this.onMapLoaded(() => this.syncMapToTask(task));
    }
  },

  fetchNextTask: function () {
    this.props._fetchNextTask(this.state.skippedTasks);
  },

  onMapLoaded: function (fn) {
    if (this.map.loaded()) fn();
    else this.map.once('load', fn);
  },

  syncMapToTask: function (task) {
    const { map } = this;
    const existingSource = map.getSource(source);
    if (!existingSource) {
      map.addSource(source, {
        type: 'geojson',
        data: task
      });
      layers.forEach(layer => {
        map.addLayer(layer);
      });
    } else {
      existingSource.setData(task);
    }
    map.fitBounds(getExtent(task), {
      linear: true,
      padding: 25
    });
  },

  renderPlaceholder: function () {
    return (
      <div className='placeholder__fullscreen'>
        <h3 className='placeholder__message'>Loading your first task...</h3>
      </div>
    );
  },

  renderPropertiesOverlay: function () {
    const { hoverId } = this.state;
    const { task } = this.props;
    const properties = task.features.find(c => hoverId === c.properties._id).properties;
    const displayList = Object.keys(properties).map(key => key.charAt(0) === '_' ? null : [
      <dt key={`${key}-key`}><strong>{key}</strong></dt>,
      <dd key={`${key}-value`}>{properties[key] || '--'}</dd>
    ]).filter(Boolean);
    return (
      <aside className='properties__overlay'>
        <dl>
          {displayList}
        </dl>
      </aside>
    );
  },

  renderInstrumentPanel: function () {
    return (
      <div className='map-options map-panel'>
        <h2>Tasks</h2>
        <div className='form-group'>
          <p>1. Select the roads to fix</p>
          {this.renderSelectedIds()}
        </div>
        <div className={c('form-group', {disabled: this.state.selectedIds.length < 2})}>
          <p>2. Select the action</p>
          <button className='bttn bttn-m bttn-secondary' type='button' onClick={this.onMerge}>Merge Geometries</button>
          <button className={c('bttn bttn-m bttn-secondary', {disabled: this.state.selectedIds.length > 2})} type='button' onClick={this.onJoin}>Join Intersection</button>
        </div>
        <div className='form-group'>
          <button className='bttn bttn-m bttn-secondary' type='button' onClick={this.next}>Next task</button>
        </div>
      </div>
    );
  },

  onJoin: function () {
    // Get the 2 selected roads. There's a strict maximum of 2 for intersection.
    let roadA = this.props.task._collisions.find(o => o._id === this.state.selectedIds[0]);
    let roadB = this.props.task._collisions.find(o => o._id === this.state.selectedIds[1]);

    let intersection = intersect(roadA, roadB);

    if (!intersection.features.length) {
      alert('Error: Roads do not intersect.');
    }

    // - Create the appropriate structure from ALL the intersecting points in
    // intersection.features
    // - Submit to the API
    // - The UI should be refreshed to show the changes. (re-retch the
    // same task?)
    console.log('intersection', intersection);
  },

  onMerge: function () {
    // - Get the selected roads.
    // - Merge them?
    // - Create the appropriate structure
    // - Submit to the API
    // - The UI should be refreshed to show the changes. (re-retch the
    // same task?)
  },

  next: function () {
    // Deselect roads.
    this.map.setFilter(roadSelected, ['all', ['in', '_id', '']]);

    // Add the skipped task to state, so we can request one we haven't gotten yet.
    const skippedTasks = this.state.skippedTasks.concat([this.state.currentTaskId]);
    this.setState({ selectedIds: [], skippedTasks }, this.fetchNextTask);
  },

  renderSelectedIds: function () {
    const { selectedIds } = this.state;
    if (!selectedIds.length) {
      return <p className='empty'>No roads selected yet. Click a road to select it.</p>;
    }
    if (selectedIds.length === 1) {
      return <p>1 road selected. Select at least another one.</p>;
    }
    return <p>{selectedIds.length} roads selected.</p>;
  },

  render: function () {
    const { hoverId } = this.state;
    const { task } = this.props;
    return (
      <div className='task-container'>
        <div className='map-container'>
          <div id='map' />
        </div>
        {!task ? this.renderPlaceholder() : null}
        {hoverId ? this.renderPropertiesOverlay() : null}
        {this.renderInstrumentPanel()}
      </div>
    );
  }
});

function selector (state) {
  return {
    task: state.waytasks.data,
    taskId: state.waytasks.id
  };
}

function dispatcher (dispatch) {
  return {
    _fetchNextTask: function (skippedTasks) { dispatch(fetchNextWayTask(skippedTasks)); },
    _setGlobalZoom: function (...args) { dispatch(setGlobalZoom(...args)); }
  };
}

module.exports = connect(selector, dispatcher)(Tasks);

function findIndex (haystack, fn) {
  let idx = -1;
  haystack.some((o, i) => {
    if (fn(o)) {
      idx = i;
      return true;
    }
    return false;
  });

  return idx;
}
