import { createSelector } from 'reselect';

const userReducerSelector = (state) => state.user;

export const userInfoSelector = createSelector([userReducerSelector], (userInfoSlice) => userInfoSlice.userInfo);

export const accessTokenSelector = createSelector([userReducerSelector], (userInfoSlice) => userInfoSlice.accessToken);
