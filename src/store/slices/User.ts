import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CLEARANCE, Clearance } from '../types/';

interface UserData {
  email: string;
  username: string;
  firstMame: string;
  lastName: string;
  picture?: string;
}

interface AuthData {
  authToken: string | null;
  clearance: Clearance,
  isAuthenticated: boolean;
}

interface LoginData {
  user: UserData;
  auth: AuthData;
}

interface UserState {
  user: UserData | null;
  auth: AuthData;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  auth: {
    authToken: null,
    isAuthenticated: false,
    clearance: CLEARANCE.GUEST,
  },
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
    loginSuccess: (state, action: PayloadAction<LoginData>) => {
      state.user = action.payload.user;
      state.auth = action.payload.auth;
      state.loading = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.auth = {
        authToken: null,
        isAuthenticated: false,
        clearance: CLEARANCE.GUEST
      };
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.auth = {
        authToken: null,
        isAuthenticated: false,
        clearance: CLEARANCE.GUEST
      };
      state.loading = false;
      state.error = null;
    },
  },
});

export const UserStateActions = UserSlice.actions;

export default UserSlice.reducer;
