import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncHistory } from 'react-router-redux';
import reducer from './reducer';
import { hashHistory } from 'react-router';
import logger from 'redux-logger';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(logger, syncHistory(hashHistory), thunkMiddleware)
  )
);
