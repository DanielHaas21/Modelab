import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Clearance } from '../types/';

interface UserData {
  clearance: Clearance;
  email: string;
  username: string;
  firstMame: string;
  lastName: string;
  picture?: string;
  token: string;
}

interface UserState {
  user: UserData | null;
  isAuthenticated: boolean;
  authToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: {
    clearance: 2,
    email: "skibiditoilet",
    username: "test",
    firstMame: "name",
    lastName: "other name",
    token: ""
  },
  isAuthenticated: true, // for dev purposes can be set to true
  authToken: null,
  loading: false,
  error: null,
};

const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginFailure, logout, loginSuccess } = UserSlice.actions;

export default UserSlice.reducer;
