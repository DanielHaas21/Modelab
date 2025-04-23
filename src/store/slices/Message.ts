import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Variant } from '../types';

interface Message {
  variant: Variant;
  message: string;
}

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = { messages: [] };

const MessageSlice = createSlice({
  name: 'Message',
  initialState,
  reducers: {
    Add: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    Remove: (state, action: PayloadAction<number>) => {
      state.messages.splice(action.payload, 1);
    },
  },
});

export const { Add, Remove } = MessageSlice.actions;

export default MessageSlice.reducer;
