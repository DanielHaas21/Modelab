import { configureStore } from '@reduxjs/toolkit';
import ModeSlice from './slices/Mode';
import UserSlice from './slices/User';
import PopupSlice from './slices/Popup';
import MessageSlice from './slices/Message';
import BrowserFilterSlice from './slices/BrowserFilter';

export const store = configureStore({
  reducer: {
    Mode: ModeSlice,
    User: UserSlice,
    Popup: PopupSlice,
    Message: MessageSlice,
    BrowserFilter: BrowserFilterSlice,
  },
});

// config types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
