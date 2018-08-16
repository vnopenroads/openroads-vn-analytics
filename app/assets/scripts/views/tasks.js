import React from 'react';
import {
  compose,
  lifecycle,
  getContext
} from 'recompose';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import getExtent from 'turf-extent';
import { Link } from 'react-router';
import intersect from '@turf/line-intersect';
import pointOnLine from '@turf/point-on-line';
import point from 'turf-point';
import { coordReduce } from '@turf/meta';
import getDistance from '@turf/distance';
import moment from 'moment';
import {
  queryOsmEpic,
  deleteEntireWaysEpic
} from '../redux/modules/osm';
import {
  setMapPosition
} from '../redux/modules/map';
import {
  fetchNextWayTaskEpic,
  fetchWayTaskCountEpic,
  markWayTaskPendingEpic,
  skipTask,
  selectWayTaskProvince,
  dedupeWayTaskEpic
} from '../redux/modules/tasks';
import { fetchProvinces } from '../actions/action-creators.js';
import { createModifyLineString } from '../utils/to-osm';
import T, {
  translate
} from '../components/t';
import TaskListItem from '../components/task-list-item';
import Select from 'react-select';
import _ from 'lodash';

const source = 'collisions';
const roadHoverId = 'road-hover';
const roadSelected = 'road-selected';
const roadSelectedStep1 = 'road-selected-step1';
const layers = [{
  id: 'road',
  type: 'line',
  source,
  paint: {
    'line-width': 4,
    'line-opacity': 0.2
  },
  layout: { 'line-cap': 'round' }
}, {
  id: roadHoverId,
  type: 'line',
  source,
  paint: {
    'line-width': 6,
    'line-opacity': 0.9
  },
  layout: { 'line-cap': 'round' },
  filter: ['==', '_id', '']
}, {
  id: roadSelected,
  type: 'line',
  source,
  paint: {
    'line-width': 6,
    'line-opacity': 0.9,
    'line-color': '#FF0000'
  },
  layout: { 'line-cap': 'round' },
  filter: ['==', '_id', '']
}, {
  id: roadSelectedStep1,
  type: 'line',
  source,
  paint: {
    'line-width': 6,
    'line-opacity': 0.9,
    'line-color': '#8F1812'
  },
  layout: { 'line-cap': 'round' },
  filter: ['==', '_id', '']
}];

const layerIds = layers.map(layer => layer.id);

var Tasks = React.createClass({
  getInitialState: function () {
    return {
      renderedFeatures: null,
      mode: 'dedupe',

      // Steps are 0, 1 and 2 in accordance with new step workflow
      step: 0,
      hoverId: '',
      selectedIds: [],
      selectedStep0: [], // ids of selected features in step 0
      selectedStep1: null, // in step "1", there can only ever be one id selected
      selectedProvince: null,
      selectedVpromm: null
    };
  },

  propTypes: {
    fetchNextTask: React.PropTypes.func,
    setMapPosition: React.PropTypes.func,
    _queryOsm: React.PropTypes.func,
    _markTaskAsDone: React.PropTypes.func,
    _deleteWays: React.PropTypes.func,
    skipTask: React.PropTypes.func,
    fetchTaskCount: React.PropTypes.func,
    osmStatus: React.PropTypes.string,
    taskStatus: React.PropTypes.string,
    meta: React.PropTypes.object,
    task: React.PropTypes.object,
    taskId: React.PropTypes.number,
    taskUpdatedAt: React.PropTypes.string,
    taskCount: React.PropTypes.number,
    selectOptions: React.PropTypes.object,
    selectedProvince: React.PropTypes.number,
    selectNextTaskProvince: React.PropTypes.func,
    dedupeWayTask: React.PropTypes.func,
    language: React.PropTypes.string
  },

  componentDidMount: function () {
    mapboxgl.accessToken = config.mbToken;
    const map = this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false,
      zoom: 12
    }).addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Disable map rotation using right click + drag.
    this.map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture.
    this.map.touchZoomRotate.disableRotation();

    // Remove compass.
    document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass').remove();

    this.onMapLoaded(() => {
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

        this.hoverItemOver(id);
      });

      map.on('click', (e) => {
        const { step } = this.state;
        let features = map.queryRenderedFeatures(e.point, { layers: [ roadHoverId ] });
        if (features.length && features[0].properties._id) {
          let featId = features[0].properties._id;
          if (step === 0) {
            this.selectStep0(featId);
          } else if (step === 1) {
            this.selectStep1(featId);
          } else {
            // do nothing
          }
        }
      });
    });
  },

  componentWillReceiveProps: function ({ task: nextTask, taskId: nextTaskId, osmStatus: nextOsmStatus }) {
    if (this.props.task !== nextTask) {
      // TODO - ANTIPATTERN: should not mirror properties task and taskId in state
      this.setState({ renderedFeatures: nextTask }, () => this.onMapLoaded(() => this.syncMap()));
    } else if (this.props.osmStatus === 'pending' && nextOsmStatus === 'complete') {
      // We've just successfully completed an osm changeset

      // TODO - move this state into redux store so it can be modified directly by actions
      // specifically, COMPLETE_OSM_CHANGE
      this.setState({
        selectedIds: [],
        mode: null
      });
    }
  },

  componentWillUnmount: function () {
    const { lng, lat } = this.map.getCenter();
    const zoom = this.map.getZoom();
    this.props.setMapPosition(lng, lat, zoom);
  },

  onMapLoaded: function (fn) {
    if (this.map.loaded()) fn();
    else this.map.once('load', fn);
  },

  syncMap: function () {
    const features = this.state.renderedFeatures;
    const { map } = this;
    const existingSource = map.getSource(source);
    const selectedIds = [].concat(this.state.selectedStep0);
    const selectedStep1 = this.state.selectedStep1 || '';
    const hoverId = this.state.hoverId;
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
    map.setFilter(roadSelected, ['in', '_id'].concat(selectedIds));
    map.setFilter(roadHoverId, ['==', '_id', hoverId]);
    map.setFilter(roadSelectedStep1, ['==', '_id', selectedStep1]);
  },

  renderPropertiesOverlay: function () {
    const { hoverId } = this.state;
    const { task } = this.props;
    const properties = task.features.find(c => hoverId === c.properties._id).properties;
    const displayList = Object.keys(properties)
      .filter(key => key.charAt(0) !== '_' && typeof properties[key] === 'string')
      .map(key => [
        <dt key={`${key}-key`}><strong>{key}</strong></dt>,
        <dd key={`${key}-value`}>{properties[key] ? properties[key] : '--'}</dd>
      ]);
    return (
      <div className='map__controls map__controls--top-left'>
        <figcaption className='panel properties-panel'>
          <div className='panel__body'>
            <dl>
              {displayList}
            </dl>
          </div>
        </figcaption>
      </div>
    );
  },

  getPanelTitle: function () {
    const { mode, step } = this.state;
    if (step === 0) {
      return 'Prepare workflow';
    }
    if (step === 1 && mode === 'dedupe') {
      return 'Remove duplicates';
    }
    if (step === 1 && mode === 'join') {
      return 'Create intersection';
    }
    if (step === 2) {
      return 'Workflow completed';
    }
  },

  renderInstrumentPanel: function () {
    const { step, renderedFeatures } = this.state;
    const { osmStatus, language, taskId, taskUpdatedAt } = this.props;
    const diffHours = moment().diff(taskUpdatedAt, 'hours');
    const hoursText = diffHours === 1 ? translate(language, 'hour ago') : translate(language, 'hours ago');
    const panelTitle = this.getPanelTitle();
    if (osmStatus === 'pending') {
      return (
        <div className='map__controls map__controls--column-right'>
          <div className='panel tasks-panel'>
            <div className='panel__body'>
              <h2><T>Performing action...</T></h2>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='map__controls map__controls--column-right'>
        <article className='panel task-panel'>
          {renderedFeatures &&
            <header className='panel__header'>
              <div className='panel__headline'>
                <h1 className='panel__sectitle'><T>Task</T> #{ taskId }</h1>
                <p className='panel__subtitle'><time dateTime={ taskUpdatedAt }>{ diffHours } { hoursText }</time></p>
                <h2 className='panel__title'><T>{ panelTitle }</T></h2>
              </div>
            </header>
          }

          { step === 0 && renderedFeatures && this.renderStep0() }
          { step === 1 && renderedFeatures && this.renderStep1() }
          { step === 2 && renderedFeatures && this.renderStep2() }

          <footer className='panel__footer'>

            { step === 0 && renderedFeatures && this.renderActionsStep0() }
            { step === 1 && renderedFeatures && this.renderActionsStep1() }
            { step === 2 && renderedFeatures && this.renderActionsStep2() }

          </footer>
        </article>
      </div>
    );
  },

  // reset selected items when user changes mode, user can only change mode in step 0
  handleChangeMode: function (event) {
    this.setState({mode: event.target.value, selectedStep0: []}, this.syncMap);
  },

  // trigger when an item is selected during step 0
  selectStep0: function (id) {
    const { mode, selectedStep0 } = this.state;
    let selectedClone = [].concat(selectedStep0);
    if (mode === 'dedupe') { // user can select multiple
      if (selectedClone.includes(id)) {
        selectedClone.splice(selectedClone.indexOf(id));
      } else {
        selectedClone.push(id);
      }
    } else if (mode === 'join') { // Intersect mode will only allow one element to be selected
      if (selectedClone[0] === id) {
        selectedClone = [];
      } else {
        selectedClone[0] = id;
      }
    }
    this.setState({ selectedStep0: selectedClone }, this.syncMap);
  },

  selectStep1: function (id) {
    this.setState({ selectedStep1: id }, this.syncMap);
  },

  hoverItemOver: function (id) {
    this.setState({ hoverId: id }, this.syncMap);
  },

  hoverItemOut: function (id) {
    this.setState({ hoverId: '' }, this.syncMap);
  },

  renderStep0: function () {
    const { renderedFeatures, mode, selectedStep0, hoverId } = this.state;
    const { language } = this.props;
    const title = mode === 'dedupe' ? 'Select roads to work on' : 'Select road to work on';
    const type = mode === 'dedupe' ? 'checkbox' : 'radio';

    // we need to assign these translated strings as variables
    // because if we use the <T> tag inside an <option>, it generates invalid markup
    // by inserting a <span> around the string
    const removeDuplicatesT = translate(language, 'Remove duplicates');
    const createIntersectionT = translate(language, 'Create intersection');
    return (
      <div className='panel__body'>
        <section className='task-group'>
          <header className='task-group__header'>
            <h1 className='task-group__title'><T>Select action to perform</T></h1>
          </header>
          <div className='task-group__body'>
            <form className='form task-group__actions'>
              <div className='form__group'>
                <label className='form__label visually-hidden'><T>Actions</T></label>
                <select className='form__control' value={ mode } onChange={ this.handleChangeMode }>
                  <option value='dedupe'>{ removeDuplicatesT }</option>
                  <option value='join'>{ createIntersectionT }</option>
                </select>
              </div>
            </form>
          </div>
        </section>
        <section className='task-group'>
          <header className='task-group__header'>
            <h1 className='task-group__title'><T>{ title }</T></h1>
          </header>
          <div className='task-group__body'>
            <ul className='road-list'>
              {
                renderedFeatures.features.map(road =>
                  <TaskListItem
                    vpromm={ road.properties.or_vpromms }
                    province={ road.properties.province }
                    _id={ road.properties._id }
                    mode={ mode }
                    type={ type }
                    language={ language }
                    key={ road.properties._id }
                    selected={ selectedStep0.includes(road.properties._id) }
                    isHighlighted={ road.properties._id === hoverId }
                    onMouseOver={ this.hoverItemOver }
                    onMouseOut={ this.hoverItemOut }
                    toggleSelect={ this.selectStep0 }
                  />
                )
              }
            </ul>
          </div>
        </section>
      </div>
    );
  },

  renderActionsStep0: function () {
    const { mode, selectedStep0 } = this.state;
    let isDisabled;
    if (mode === 'dedupe') {
      isDisabled = selectedStep0.length < 2;
    } else if (mode === 'join') {
      isDisabled = selectedStep0.length === 0;
    }
    return (
      <div className='panel__f-actions'>
        <button type='button' className='pfa-secondary' onClick={ this.next }>
          <span><T>Skip task</T></span>
        </button>
        <button
          type='button'
          className={`pfa-primary ${isDisabled ? 'disabled' : ''}`}
          disabled={ isDisabled }
          onClick={ this.gotoStep1 }
        >
          <span><T>Continue</T></span>
        </button>
      </div>
    );
  },

  renderActionsStep1: function () {
    const { mode, selectedStep1 } = this.state;
    const isDisabled = !selectedStep1;
    let onClick;
    if (mode === 'join') {
      onClick = this.commitJoin;
    } else if (mode === 'dedupe') {
      onClick = this.commitDedupe;
    }
    return (
      <div className='panel__f-actions'>
        <button type='button' className='pfa-secondary' onClick={ this.gotoStep0 }>
          <span><T>Back</T></span>
        </button>
        <button
          type='button'
          className={`pfa-primary ${isDisabled ? 'disabled' : ''}`}
          disabled={ isDisabled }
          onClick={ onClick }
        >
          <span><T>Apply</T></span>
        </button>
      </div>
    );
  },

  doMore: function () {
    this.setState({
      selectedStep0: [],
      selectedStep1: null,
      step: 0
    }, this.syncMap);
  },

  renderActionsStep2: function () {
    return (
      <div className='panel__f-actions'>
        <button type='button' className='pfa-secondary' onClick={ this.doMore }><span><T>Do more</T></span></button>
        <button type='button' onClick={ this.next } className='pfa-primary'><span><T>Next task</T></span></button>
      </div>
    );
  },

  getSelectedVpromms: function () {
    const { renderedFeatures, selectedStep0 } = this.state;
    const vpromms = renderedFeatures.features
      .filter(feat => selectedStep0.includes(feat.properties._id))
      .map(feat => feat.properties.or_vpromms || 'No ID');
    return _.uniq(vpromms);
  },


  renderStep1: function () {
    const { mode, selectedStep0, selectedStep1, renderedFeatures, hoverId } = this.state;
    const { language } = this.props;
    let step1Features;
    const title = mode === 'dedupe' ? 'Select Road to Keep' : 'Select Road to Intersect With';
    if (mode === 'dedupe') {
      // in dedupe mode, show all features selected in previous step
      step1Features = renderedFeatures.features.filter(feat => selectedStep0.includes(feat.properties._id));
    } else if (mode === 'join') {
      // in join mode, show all features except the one selected in previous step
      step1Features = renderedFeatures.features.filter(feat => feat.properties._id !== selectedStep0[0]);
    }
    const vpromms = this.getSelectedVpromms();
    return (
      <div className='panel__body'>
        <section className='task-group'>
          <header className='task-group__header'>
            <h1 className='task-group__title'><T>{ title }</T></h1>
          </header>
          <div className='task-group__body'>
            <ul className='road-list'>
              {
                step1Features.map(road =>
                  <TaskListItem
                    vpromm={ road.properties.or_vpromms }
                    province={ road.properties.province }
                    _id={ road.properties._id }
                    mode={ mode }
                    type='radio'
                    language={ language }
                    key={ road.properties._id }
                    selected={ selectedStep1 === road.properties._id }
                    isHighlighted={ road.properties._id === hoverId }
                    onMouseOver={ this.hoverItemOver }
                    onMouseOut={ this.hoverItemOut }
                    toggleSelect={ this.selectStep1 }
                  />
                )
              }
            </ul>
          </div>
        </section>
        { mode === 'dedupe' &&
        <section className='task-group'>
          <header className='task-group__header'>
            <h1 className='task-group__title'><T>Select VPROMMID to Apply</T></h1>
          </header>
          <div className='task-group__body'>
            <form className='form task-group__actions'>
              <div className='form__group'>
                <label className='form__label visually-hidden'><T>VPROMMIDs</T></label>
                <select className='form__control' onChange={ this.selectVpromm }>
                  { vpromms.map(id =>
                    <option key={ id } value={ id }>{ id }</option>
                  )
                  }
                </select>
              </div>
            </form>
          </div>
        </section>
        }
      </div>
    );
  },

  renderStep2: function () {
    const { mode, selectedStep0 } = this.state;
    const { language } = this.props;

    const numRoads = mode === 'dedupe' ? selectedStep0.length - 1 : 2;
    const roadStr = numRoads === 1 ? translate(language, 'road was') : translate(language, 'roads were');
    const actionStr = mode === 'dedupe' ? translate(language, 'removed') : translate(language, 'intersected');
    return (
      <div className='panel__body'>
        <div className='prose task-prose'>
          <p>{numRoads} {roadStr} {actionStr} <T>and submitted to the system for review.</T></p>
          <p><T>Do you want to continue to work on this task or move to the next one?</T></p>
        </div>
      </div>
    );
  },

  gotoStep0: function () {
    this.setState({step: 0, selectedStep1: null}, this.syncMap);
  },

  gotoStep1: function () {
    this.setState({step: 1});
  },

  gotoStep2: function () {
    this.setState({step: 2});
  },

  handleSelectVprommid: function (selectedVprommid) {
    this.setState({ applyVprommid: selectedVprommid });
  },

  commitDedupe: function () {
    const { selectedStep1, renderedFeatures, applyVprommid } = this.state;
    const { features } = renderedFeatures;
    const toDelete = features.filter(feature => feature.properties._id !== selectedStep1);
    const wayIdToKeep = selectedStep1;
    this.props.dedupeWayTask(this.props.taskId, toDelete.map(feature => feature.properties._id), wayIdToKeep, applyVprommid === 'No ID' ? null : applyVprommid);
    // this.props._deleteWays(this.props.taskId, toDelete.map(feature => feature.properties._id));

    // TODO - should deduping mark task as done?
    this.props._markTaskAsDone(toDelete.map(feature => feature.properties._id));
    this.gotoStep2();
  },

  commitJoin: function () {
    const { selectedStep0, selectedStep1, renderedFeatures } = this.state;
    const { features } = renderedFeatures;
    const line1 = features.find(f => f.properties._id === selectedStep0[0]);
    const line2 = features.find(f => f.properties._id === selectedStep1);
    const intersectingFeatures = intersect(line1, line2);
    const changes = [];

    if (!intersectingFeatures.features.length) {
      // lines don't intersect, find the two nearest points on the two respective lines.
      const closestPoints = coordReduce(line1, (context, line1Point) => {
        // If we find two points with shorter distance between them,
        // set the coordinates on the second line to this variable.
        let closerLine2Point = null;
        let bestDistance = coordReduce(line2, (currentBest, line2Point) => {
          let distance = getDistance(line1Point, line2Point);
          if (distance < currentBest) {
            closerLine2Point = line2Point;
            return distance;
          }
          return currentBest;
        }, context.distance);

        if (closerLine2Point) {
          return {
            distance: bestDistance,
            line1Point,
            line2Point: closerLine2Point
          };
        }
        return context;
      }, {distance: Infinity, line1Point: null, line2Point: null});


      // Figure out where to add the extra point.
      // For either line, if the closest coordinate is at the start or tail end of the line,
      // we can just add it to the beginning or end.
      const line1Point = pointOnLine(line1, point(closestPoints.line1Point));
      const line2Point = pointOnLine(line2, point(closestPoints.line2Point));

      if (line1Point.properties.index === 0
        || line1Point.properties.index === line1.geometry.coordinates.length - 1) {
        changes.push(insertPointOnLine(line1, line2Point));
      } else if (line2Point.properties.index === 0
        || line2Point.properties.index === line2.geometry.coordinates.length - 1) {
        changes.push(insertPointOnLine(line2, line1Point));
      } else {
        changes.push(insertPointOnLine(line1, point(closestPoints.line2Point)));
        changes.push(insertPointOnLine(line2, point(closestPoints.line1Point)));
      }
    } else {
      let intersection = intersectingFeatures.features[0];
      changes.push(insertPointOnLine(line1, intersection));
      changes.push(insertPointOnLine(line2, intersection));
    }

    const changeset = createModifyLineString(changes);

    this.props._queryOsm(this.props.taskId, changeset);

    // TODO - should deduping mark task as done?
    this.props._markTaskAsDone([line1.properties._id, line2.properties._id]);

    this.gotoStep2();
  },

  markAsDone: function () {
    // This function is different from #next, in that it allows you
    // to specify all visible roads as 'done'
    this.props._markTaskAsDone(this.state.renderedFeatures.features.map(feature => Number(feature.properties._id)));
    this.props.fetchTaskCount();
    this.next();
  },

  next: function () {
    this.map.setFilter(roadSelected, ['all', ['in', '_id', '']]);
    this.props.skipTask(this.props.taskId);
    this.setState({ selectedStep0: [], selectedStep1: null, mode: 'dedupe', selectedVpromm: null, step: 0, renderedFeatures: null }, this.props.fetchNextTask);
  },

  handleProvinceChange: function (selectedProvince) {
    const value = selectedProvince ? selectedProvince.value : null;
    this.props.selectNextTaskProvince(value);
    this.props.fetchNextTask();
  },

  renderProvinceSelect: function () {
    const { selectedProvince, language } = this.props;
    const provinceOptions = this.props.selectOptions.province.map((p) => { return {value: p.id, label: p.name_en}; });
    const value = selectedProvince;
    return (
      <Select
        name="form-province-select"
        value={value}
        onChange= {this.handleProvinceChange}
        options={ provinceOptions }
        placeholder ={ translate(language, 'Filter tasks by province') }
      />
    );
  },

  render: function () {
    const { taskId, taskCount, taskStatus } = this.props;
    const { hoverId } = this.state;
    const renderPanel = !((taskStatus === 'error' || taskStatus === 'No tasks remaining') ||
      (!taskId && taskStatus === 'pending'));

    return (
      <section className='inpage inpage--alt'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><T>Tasks</T></h1>
            </div>
            <nav className='inpage__nav'>
              <ul className='inpage__menu'>
                <li><Link to={`/${this.props.language}/tasks`} className='inpage__menu-link' activeClassName='inpage__menu-link--active' title='View'><span><T>Solve</T> <small className='label'>{ taskCount }</small></span></Link></li>
                <li><a className='inpage__menu-link disabled' href='#' title='View'><span><T>Stats</T></span></a></li>
              </ul>
            </nav>
            <div className='inpage__actions'>
              <div className='form__group task-search'>
                <label className='form__label' htmlFor='form-select-1'><T>Search admin area</T></label>
                { this.props.selectOptions.province && this.renderProvinceSelect() }
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>

            <figure className='map'>
              <div className='map__media' id='map'></div>
              {
                hoverId && this.renderPropertiesOverlay()
              }
              {
                taskStatus === 'error' &&
                <div className='placeholder__fullscreen'>
                  <h3 className='placeholder__message'><T>Error</T></h3>
                </div>
              }
              {
                taskStatus === 'No tasks remaining' &&
                <div className='placeholder__fullscreen'>
                  <h3 className='placeholder__message'><T>No tasks remaining</T></h3>
                </div>
              }
              {
                !taskId && taskStatus === 'pending' &&
                <div className='placeholder__fullscreen'>
                  <h3 className='placeholder__message'><T>Loading</T></h3>
                </div>
              }
              {
                renderPanel && this.renderInstrumentPanel()
              }
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
      task: state.waytasks.geoJSON,
      taskId: state.waytasks.id,
      taskUpdatedAt: state.waytasks.updatedAt,
      taskCount: state.waytasks.taskCount,
      taskStatus: state.waytasks.status,
      osmStatus: state.osmChange.status,
      selectOptions: state.provinces.data,
      selectedProvince: state.waytasks.selectedProvince
    }),
    dispatch => ({
      fetchProvinces: () => dispatch(fetchProvinces()),
      selectNextTaskProvince: (provinceId) => dispatch(selectWayTaskProvince(provinceId)),
      dedupeWayTask: (taskId, wayIds, wayIdToKeep, dedupeVprommid) => dispatch(dedupeWayTaskEpic(taskId, wayIds, wayIdToKeep, dedupeVprommid)),
      fetchNextTask: () => dispatch(fetchNextWayTaskEpic()),
      fetchTaskCount: () => dispatch(fetchWayTaskCountEpic()),
      skipTask: (id) => dispatch(skipTask(id)),
      _markTaskAsDone: (taskIds) => dispatch(markWayTaskPendingEpic(taskIds)),
      _queryOsm: (taskId, payload) => dispatch(queryOsmEpic(taskId, payload)),
      _deleteWays: (taskId, wayIds) => dispatch(deleteEntireWaysEpic(taskId, wayIds)),
      setMapPosition: (lng, lat, zoom) => dispatch(setMapPosition(lng, lat, zoom))
    })
  ),
  lifecycle({
    componentDidMount: function () {
      // TODO - data fetching for this page should be moved into a route container
      // fire to get all the provinces here.
      this.props.fetchProvinces();
      this.props.fetchNextTask();
      this.props.fetchTaskCount();
    }
  })
)(Tasks);

function insertPointOnLine (feature, point) {
  const nearest = pointOnLine(feature, point);
  const { index } = nearest.properties;
  const coordinates = feature.geometry.coordinates.slice();
  const targetIndex = index === 0 ? 0
    : index === coordinates.length - 1 ? coordinates.length
      : getDistance(point, coordinates[index - 1]) < getDistance(point, coordinates[index + 1]) ? index : index + 1;
  coordinates.splice(targetIndex, 0, point.geometry.coordinates);
  return Object.assign({}, feature, {
    geometry: {
      type: 'LineString',
      coordinates
    }
  });
}
