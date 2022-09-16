import { createStore, compose, applyMiddleware } from 'redux';

import logger from 'redux-logger';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { rootReducer } from './root-reducer';

const persistConfiguration = {
  key: 'root',
  storage,
};

const middleWares = [logger];
const composedEnhancers = compose(applyMiddleware(...middleWares));

const poersistedReducer = persistReducer(persistConfiguration, rootReducer);

export const store = createStore(poersistedReducer, undefined, composedEnhancers);

export const persister = persistStore(store);
