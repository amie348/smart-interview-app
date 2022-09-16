import { ACTION_TYPES } from './userActionTypes';

const INITIAL = {
  userInfo: {},
  accessToken: ``,
};

export const userReducer = (state = INITIAL, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case ACTION_TYPES.SET_USER:
      return {
        ...state,
        userInfo: { ...payload.user },
        accessToken: `bearer ${payload.accessToken}`,
      };

    case ACTION_TYPES.LOG_OUT:
      return {
        ...state,
        ...INITIAL,
      };

    case ACTION_TYPES.SWITCH_ROLE:
      return {
        ...state,
        userInfo: { ...state.userInfo, role: payload },
      };

    default:
      return state;
  }
};
