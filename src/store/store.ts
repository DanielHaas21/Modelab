import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slices/User';
import PopupSlice from './slices/Popup';
import BrowserFilterSlice from './slices/BrowserFilter';
import ConfirmationSlice from './slices/Confirmation';

export const store = configureStore({
  reducer: {
    User: UserSlice,
    Popup: PopupSlice,
    BrowserFilter: BrowserFilterSlice,
    ConfirmationSlice: ConfirmationSlice,
  },
});

// config types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
