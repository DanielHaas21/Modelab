import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  id: string | number;
  clearance: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  picture?: string;
}

interface UserState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: true, // for dev purposes can be set to true
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
