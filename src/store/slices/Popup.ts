import { createSlice } from '@reduxjs/toolkit';

interface PopupState {
  value: boolean;
}

const initialState: PopupState = { value: false };

const PopupSlice = createSlice({
  name: 'Popup',
  initialState,
  reducers: {
    Hide: (state) => {
      state.value = false;
    },
    Show: (state) => {
      state.value = true;
    },
  },
});

export const { Hide, Show } = PopupSlice.actions;

export default PopupSlice.reducer;
