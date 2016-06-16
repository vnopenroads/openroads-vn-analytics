'use strict';
/* global L */
require('mapbox.js');
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory, Redirect } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncHistory } from 'react-router-redux';
import reducer from './reducers/reducer';
import config from './config';

L.mapbox.accessToken = config.mbToken;

import UhOh from './views/uhoh';
import App from './views/app';
import Home from './views/home';
import Editor from './views/editor';
import AnalyticsAA from './views/analytics-admin-area';
import AdminAreas from './views/admin-areas';
import TofixTasks from './views/tofix-tasks';
import ProjectTasks from './views/project-tasks';
import Projects from './views/projects';

// Sync dispatched route actions to the syncHistory
const reduxRouterMiddleware = syncHistory(hashHistory);
const finalCreateStore = compose(
  // Middleware you want to use in development:
  applyMiddleware(reduxRouterMiddleware, thunkMiddleware)
  // Required! Enable Redux DevTools with the monitors you chose.
  // DevTools.instrument()
)(createStore);

const store = finalCreateStore(reducer);

// Required for replaying actions from devtools to work
// reduxRouterMiddleware.listenForReplays(store);

render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <Route path='editor' component={Editor} />
        <Route path='editor/*' component={Editor} />
        <Redirect from='analytics' to='analytics/0' />
        <Redirect from='analytics/tasks' to='analytics/0/tasks' />
        <Redirect from='analytics/projecttasks' to='analytics/0/projecttasks' />
        <Redirect from='analytics/admin-areas' to='analytics/0/admin-areas' />
        <Redirect from='analytics/projects' to='analytics/0/projects' />
        <Route path='analytics/:aaId' component={AnalyticsAA} />
        <Route path='analytics/:aaId/admin-areas' component={AdminAreas} />
        <Route path='analytics/:aaId/tasks' component={TofixTasks} />
        <Route path='analytics/:aaId/projecttasks' component={ProjectTasks} />
        <Route path='analytics/:aaId/projects' component={Projects} />
        <IndexRoute component={Home}/>
      </Route>
      <Route path='*' component={UhOh}/>
    </Router>
  </Provider>
), document.querySelector('.site-canvas'));
