'use strict';
var config = require('./config');

import React from 'react';
import ReactDOM from 'react-dom'
import { combineReducers, applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory } from 'history'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router'

import UhOh from './views/uhoh';
import App from './views/app';
import Home from './views/home';

// const reducer = combineReducers(Object.assign({}, reducers, {
//   routing: routeReducer
// }))
// const store = createStore(reducer)
// const history = createHistory()

// syncReduxAndRouter(history, store)

// ReactDOM.render(
//   <Provider store={store}>
//     <Router history={history}>
//       <Route path='/' component={App}>
//         <IndexRoute component={Home}/>
//       </Route>
//       <Route path='*' component={UhOh}/>
//     </Router>
//   </Provider>,
// ), document.querySelector('#site-canvas'));
