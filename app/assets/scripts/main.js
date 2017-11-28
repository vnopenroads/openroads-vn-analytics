'use strict';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, IndexRoute, hashHistory } from 'react-router';
import { isValidLanguage, setLanguage } from './utils/i18n';
import store from './redux/store';

import UhOh from './views/uhoh';
import App from './views/app';
import Home from './views/home';
import Editor from './views/editor';
import Tasks from './views/tasks';
import Explore from './views/explore';
import Assets from './views/assets';
import AssetsIndex from './views/assets-index';
import AssetsAA from './views/assets-admin-area';
import AAFieldMap from './components/aa-field-map';
import Upload from './views/upload';


// check if link target is one of the languages in the i18n file
// if it is, set that as the language
function validateLanguage (nextState, replace) {
  if (isValidLanguage(nextState.params.lang)) {
    setLanguage(nextState.params.lang);
  } else {
    replace('/en/404');
  }
}

render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/:lang' component={App} onEnter={validateLanguage}>
        <Route path='tasks' component={Tasks} pageClass='tasks' />
        <Route path='upload' component={Upload} pageClass='upload' />
        <Route path='editor' component={Editor} pageClass='editor' />
        <Route path='editor/*' component={Editor} pageClass='editor' />
        <Route path='explore' component={Explore} pageClass='explore' />
        <Route path='assets' component={Assets}>
          <Route path='road' component={Assets} >
            <Route path=':vpromm' component={AAFieldMap} pageClass='assets-aa'/>
          </Route>
          <IndexRoute component={AssetsIndex} pageClass='assets' />
          <Route path=':aaId' component={AssetsAA} pageClass='assets-aa' />
          <Route path=':aaId/:aaIdSub' component={AssetsAA} pageClass='assets-aa' />
        </Route>
        <IndexRoute component={Home} pageClass='page--landing' />
        <Route path='*' component={UhOh}/>
      </Route>
      <Redirect from='/' to='/en' />
    </Router>
  </Provider>
), document.querySelector('.site-canvas'));
