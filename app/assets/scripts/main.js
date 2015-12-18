import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { createHashHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncReduxAndRouter } from 'redux-simple-router';

import reducer from './reducers/reducer';
import UhOh from './views/uhoh';
import App from './views/app';
import Home from './views/home';
import Analytics from './views/analytics';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware // lets us dispatch() functions
)(createStore);

const store = createStoreWithMiddleware(reducer);
const history = createHashHistory();
syncReduxAndRouter(history, store);

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <Route path='analytics/:aaId' component={Analytics} />
        <IndexRoute component={Home}/>
      </Route>
      <Route path='*' component={UhOh}/>
    </Router>
  </Provider>
), document.querySelector('.site-canvas'));
