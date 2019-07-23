import throttle from 'lodash.throttle';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index';
import { saveState } from './localStorage';

const store = createStore(reducers, applyMiddleware(thunk));

store.subscribe(throttle(() => saveState(store.getState()), 1000));

export default store;
