import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;

export const performLogout = () => (dispatch) => {
  dispatch(logout());
  dispatch(apiSlice.util.invalidateTags(['Task']));
};

export default authSlice.reducer;
