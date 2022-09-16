import { combineReducers } from 'redux';

import { userReducer } from '../sections/auth/state/userReducers';

export const rootReducer = combineReducers({
  user: userReducer,
});
