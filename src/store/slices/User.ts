import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Clearance } from '../types/';

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
}

interface LoginData {
  user: UserData;
  auth: AuthData;
}

interface UserState {
  user: UserData | null;
  auth: AuthData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  auth: null,
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
      state.auth = null;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.auth = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const UserStateActions = UserSlice.actions;

export default UserSlice.reducer;
