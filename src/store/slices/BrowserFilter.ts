import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetQueries } from '../../middleware/types/models';

export interface BrowserFilterState {
  value: AssetQueries | null;
}

const initialState: BrowserFilterState = { value: null };

const BrowserFilter = createSlice({
  name: 'BrowserFilter',
  initialState,
  reducers: {
    Set: (state, action: PayloadAction<AssetQueries>) => {
      state.value = action.payload;
    },
    Clear: (state) => {
      state.value = null;
    },
  },
});

export const { Set, Clear } = BrowserFilter.actions;

export default BrowserFilter.reducer;
