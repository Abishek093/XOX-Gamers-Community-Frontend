import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChatConversation, IMessage } from '../../interfaces/userInterfaces/apiInterfaces';

interface ChatState {
  conversations: IChatConversation[];
  unreadCounts: { [key: string]: number };
  lastMessages: { [key: string]: IMessage };
}

const initialState: ChatState = {
  conversations: [],
  unreadCounts: {},
  lastMessages: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<IChatConversation[]>) => {
      state.conversations = action.payload;
    },
    updateUnreadCount: (state, action: PayloadAction<{ chatId: string; count: number }>) => {
      state.unreadCounts[action.payload.chatId] = action.payload.count;
    },
    updateLastMessage: (state, action: PayloadAction<{ chatId: string; message: IMessage }>) => {
      state.lastMessages[action.payload.chatId] = action.payload.message;
    },
    clearUnreadCount: (state, action: PayloadAction<string>) => {
      state.unreadCounts[action.payload] = 0;
    },
  },
});

export const { setConversations, updateUnreadCount, updateLastMessage, clearUnreadCount } = chatSlice.actions;

export default chatSlice.reducer;