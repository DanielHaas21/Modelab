import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resolveAndRemove } from '../utils/Resolver';

interface ConfirmationState {
  isVisible: boolean;
  text: string;
  isDeclinable: boolean;
  confirmationId?: string;
  responseA?: string;
  body?: React.ReactNode;
  responseB?: string;
}

const initialState: ConfirmationState = {
  isVisible: false,
  text: '',
  isDeclinable: true,
};

const ConfirmationSlice = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {
    showConfirmation: (
      state,
      action: PayloadAction<{
        text: string;
        isDeclinable?: boolean;
        confirmationId: string;
        responseA?: string;
        responseB?: string;
        body?: React.ReactNode;
      }>
    ) => {
      state.isVisible = true;
      state.body = action.payload.body;
      state.text = action.payload.text;
      state.responseA = action.payload.responseA;
      state.responseB = action.payload.responseB;
      state.isDeclinable = action.payload.isDeclinable ?? true;
      state.confirmationId = action.payload.confirmationId;
    },
    resolveConfirmation: (state, action: PayloadAction<boolean>) => {
      if (state.confirmationId) {
        resolveAndRemove(state.confirmationId, action.payload); // A local resolve must be used since storing functions in props is forbidden
      }
      state.isVisible = false;
      state.text = '';
      state.confirmationId = undefined;
    },
  },
});

export const { showConfirmation, resolveConfirmation } = ConfirmationSlice.actions;

export default ConfirmationSlice.reducer;
