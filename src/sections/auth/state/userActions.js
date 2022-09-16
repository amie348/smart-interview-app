export const setUser = (userpayLoad) => ({
  type: 'SET USER',
  payload: userpayLoad,
});

export const logOutUser = () => ({
  type: 'LOG OUT',
});

export const switchRole = (role) => ({
  type: 'SWITCH_ROLE',
  payload: role,
});
