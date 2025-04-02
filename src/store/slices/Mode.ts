import { createSlice } from '@reduxjs/toolkit';
import { Mode } from '../types';

interface modeState {
  value: Mode;
}

const initialState: modeState = { value: 'light' };

const ModeSlice = createSlice({
  name: 'Mode',
  initialState,
  reducers: {
    DarkMode: (state) => {
      state.value = 'dark';
    },
    LightMode: (state) => {
      state.value = 'light';
    },
  },
});

export const { DarkMode, LightMode } = ModeSlice.actions;

export default ModeSlice.reducer;
