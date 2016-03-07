'use strict';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncHistory } from 'react-router-redux';
import reducer from './reducers/reducer';

import UhOh from './views/uhoh';
import App from './views/app';
import Home from './views/home';
import Editor from './views/editor';
import Analytics from './views/analytics';
import AdminAreas from './views/admin-areas';

// Sync dispatched route actions to the history
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
        <Route path='analytics/:aaId' component={Analytics} />
        <Route path='analytics/:aaId/admin-areas' component={AdminAreas} />
        <Route path='admin-areas' component={AdminAreas} />
        <IndexRoute component={Home}/>
      </Route>
      <Route path='*' component={UhOh}/>
    </Router>
  </Provider>
), document.querySelector('.site-canvas'));
