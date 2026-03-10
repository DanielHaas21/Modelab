import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchQuery } from '../../libs/ui/components';

export interface BrowserFilterState {
  value: SearchQuery | null;
}

const initialState: BrowserFilterState = { value: null };

const BrowserFilter = createSlice({
  name: 'BrowserFilter',
  initialState,
  reducers: {
    Set: (state, action: PayloadAction<SearchQuery>) => {
      state.value = action.payload;
    },
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    Clear: (state, action: PayloadAction) => {
      state.value = null;
    },
  },
});

export const { Set, Clear } = BrowserFilter.actions;

export default BrowserFilter.reducer;
