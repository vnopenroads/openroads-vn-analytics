'use strict';
var config = require('./config');

var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var Provider = require('react-redux').Provider;
var ReactRouter = require('react-router');
var createHistory = require('history').createHistory;
var ReduxSRouter = require('redux-simple-router');

// var UhOh = require('./views/uhoh');
// var App = require('./views/app');
// var Home = require('./views/home');

var combineReducers = Redux.combineReducers;
var applyMiddleware = Redux.applyMiddleware;
var compose = Redux.compose;
var createStore = Redux.createStore;

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var syncReduxAndRouter = ReduxSRouter.syncReduxAndRouter;
var routeReducer = ReduxSRouter.routeReducer;

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
