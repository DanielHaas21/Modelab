import { configureStore } from '@reduxjs/toolkit';
import ModeSlice from './slices/Mode';

export const store = configureStore({
  reducer: {
    Mode: ModeSlice,
  },
});

// config types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
