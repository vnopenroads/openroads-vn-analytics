'use strict';

import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import getExtent from 'turf-extent';
import c from 'classnames';
import intersect from '@turf/line-intersect';

import {
  fetchNextWayTask,
  markTaskAsDone,
  setGlobalZoom,
  queryOsm,
  reloadCurrentTask
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
      renderedFeatures: null,
      mode: null,
      skippedTasks: [],
      hoverId: null,
      selectedIds: []
    };
  },

  propTypes: {
    _fetchNextTask: React.PropTypes.func,
    _setGlobalZoom: React.PropTypes.func,
    _queryOsm: React.PropTypes.func,
    _reloadCurrentTask: React.PropTypes.func,

    osmInflight: React.PropTypes.bool,
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
      failIfMajorPerformanceCaveat: false,
      zoom: 12
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
        map.setFilter(roadHoverId, ['==', '_id', id]);
      });

      map.on('click', (e) => {
        let features = map.queryRenderedFeatures(e.point, { layers: [ roadHoverId ] });
        if (features.length && features[0].properties._id) {
          let featId = features[0].properties._id;
          let selectedIds;
          if (this.state.mode === 'dedupe') {
            selectedIds = [featId];
          } else {
            // Clone the selected array.
            selectedIds = [].concat(this.state.selectedIds);
            let idx = findIndex(selectedIds, o => o === featId);

            if (idx === -1) {
              selectedIds.push(featId);
            } else {
              selectedIds.splice(idx, 1);
            }
          }

          map.setFilter(roadSelected, ['in', '_id'].concat(selectedIds));
          this.setState({ selectedIds });
        }
      });
    });
  },

  componentWillReceiveProps: function ({taskId, task, lastUpdated}) {
    if (taskId && taskId !== this.state.currentTaskId) {
      // We've queried and received a new task
      this.setState({
        currentTaskId: taskId,
        renderedFeatures: task
      }, () => this.onMapLoaded(() => this.syncMap()));
    } else if (lastUpdated === this.state.currentTaskId) {
      // We've just successfully completed an osm changeset
      // Reload the task to sync UI with API
      this.props._reloadCurrentTask(this.state.currentTaskId);
      this.setState({
        currentTaskId: null,
        selectedIds: [],
        mode: null
      });
    }
  },

  fetchNextTask: function () {
    this.props._fetchNextTask(this.state.skippedTasks);
  },

  onMapLoaded: function (fn) {
    if (this.map.loaded()) fn();
    else this.map.once('load', fn);
  },

  syncMap: function () {
    const features = this.state.renderedFeatures;
    const { map } = this;
    const existingSource = map.getSource(source);
    if (!existingSource) {
      map.addSource(source, {
        type: 'geojson',
        data: features
      });
      layers.forEach(layer => {
        map.addLayer(layer);
      });
    } else {
      existingSource.setData(features);
    }
    map.fitBounds(getExtent(features), {
      linear: true,
      padding: 25
    });
    map.setFilter(roadSelected, ['in', '_id'].concat(this.state.selectedIds));
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
    const { mode, renderedFeatures } = this.state;
    return (
      <div className='map-options map-panel'>
        { renderedFeatures ? <h2>Showing {renderedFeatures.features.length} Roads</h2> : null }
        {mode ? null : (
          <div>
            <div className='form-group'>
              <p>1. Select roads to work on.</p>
              <div className='map__panel--selected'>
                {this.renderSelectedIds()}
              </div>
            </div>
            <div className={c('form-group', 'map__panel--form', {disabled: this.state.selectedIds.length < 2})}>
              <p>2. Choose an action to perform.</p>
              <button className='bttn bttn-m bttn-secondary' type='button' onClick={this.onDedupe}>Remove Duplicates</button>
              <br />
              <button className={c('bttn bttn-m bttn-secondary', {disabled: this.state.selectedIds.length > 2})} type='button' onClick={this.onJoin}>Join Intersection</button>
            </div>
            <div className='form-group map__panel--form'>
              <button className='bttn bttn-m bttn-secondary' type='button' onClick={this.markAsDone}>Finish task</button>
              <br />
              <button className='bttn bttn-m bttn-secondary' type='button' onClick={this.next}>Skip task</button>
            </div>
          </div>
        )}
        {mode === 'dedupe' ? this.renderDedupeMode() : null}
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

  onDedupe: function () {
    const { selectedIds } = this.state;
    const { task } = this.props;
    const selectedFeatures = {
      type: 'FeatureCollection',
      features: selectedIds.map(id => task.features.find(f => f.properties._id === id))
    };
    this.setState({mode: 'dedupe', renderedFeatures: selectedFeatures, selectedIds: []}, this.syncMap);
  },

  exitMode: function () {
    const { task } = this.props;
    this.setState({mode: null, renderedFeatures: task, selectedIds: []}, this.syncMap);
  },

  renderDedupeMode: function () {
    return (
      <div className='form-group map__panel--form'>
        <h2>Remove Duplicate Roads</h2>
        <p>Click on a road to keep. The other roads here will be deleted.</p>
              <button className={c('bttn bttn-m bttn-secondary', {disabled: !this.state.selectedIds.length})} type='button' onClick={this.commitDedupe}>Confirm</button>
        <br />
        <button className='bttn bttn-m bttn-secondary' type='button' onClick={this.exitMode}>Cancel</button>
      </div>
    );
  },

  commitDedupe: function () {
    const { selectedIds, renderedFeatures, currentTaskId } = this.state;
    const { features } = renderedFeatures;
    const toDelete = features.filter(feature => selectedIds[0] !== feature.properties._id)
    this.props._queryOsm(currentTaskId, {
      delete: {
        way: toDelete.map(feature => ({id: feature.properties._id}))
      }
    });
    this.props._markTaskAsDone(toDelete.map(feature => feature.properties._id));
  },

  markAsDone: function () {
    // This function is different from #next, in that it allows you
    // to specify all visible roads as 'done'
    this.props._markTaskAsDone(this.state.renderedFeatures.features.map(feature => feature.properties._id));
    this.next();
  },

  next: function () {
    // Deselect roads.
    this.map.setFilter(roadSelected, ['all', ['in', '_id', '']]);

    // Add the skipped task to state, so we can request one we haven't gotten yet.
    const skippedTasks = this.state.skippedTasks.concat([this.state.currentTaskId]);
    this.setState({ selectedIds: [], skippedTasks, mode: null }, this.fetchNextTask);
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

  renderInflight: function () {
    return (
      <div className='map-options map-panel'>
        <h2>Performing action...</h2>
      </div>
    );
  },

  render: function () {
    const { hoverId } = this.state;
    const { task, osmInflight } = this.props;
    return (
      <div className='task-container'>
        <div className='map-container'>
          <div id='map' />
        </div>
        {!task ? this.renderPlaceholder() : null}
        {hoverId ? this.renderPropertiesOverlay() : null}
        {osmInflight ? this.renderInflight() : this.renderInstrumentPanel()}
      </div>
    );
  }
});

function selector (state) {
  return {
    task: state.waytasks.data,
    taskId: state.waytasks.id,
    osmInflight: state.osmChange.fetching,
    lastUpdated: state.osmChange.taskId
  };
}

function dispatcher (dispatch) {
  return {
    _fetchNextTask: function (skippedTasks) { dispatch(fetchNextWayTask(skippedTasks)); },
    _markTaskAsDone: function (taskId) { dispatch(markTaskAsDone(taskId)); },
    _queryOsm: function (taskId, payload) { dispatch(queryOsm(taskId, payload)); },
    _reloadCurrentTask: function (taskId) { dispatch(reloadCurrentTask(taskId)); },
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
