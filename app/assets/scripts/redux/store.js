import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncHistory } from 'react-router-redux';
import reducer from './reducer';
import { hashHistory } from 'react-router';
import logger from 'redux-logger';
const middlewares = [syncHistory(hashHistory), thunkMiddleware];

if (process.env.DS_ENV === 'staging') {
  middlewares.push(logger);
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducer,
  composeEnhancers(
    applyMiddleware.apply(null, middlewares)
  )
);
