import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiRequest } from "../../services/ApiRequest";

// Get all chats
export const getChatHistoryAsyncThunk = createAsyncThunk(
  "chat/getChatHistoryAsyncThunk",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await ApiRequest.getChatHistory(userId);
      return res?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get messages
export const getChatMessagesAsyncThunk = createAsyncThunk(
  "chat/getChatMessagesAsyncThunk",
  async (chatId, { rejectWithValue }) => {
    try {
      const res = await ApiRequest.getChatMessages(chatId);
      return res?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Send message
export const sendMessageAsyncThunk = createAsyncThunk(
  "chat/sendMessageAsyncThunk",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await ApiRequest.sendMessage(payload);
      return res?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete chat
export const deleteChatAsyncThunk = createAsyncThunk(
  "chat/deleteChatAsyncThunk",
  async (chatId, { rejectWithValue }) => {
    try {
      await ApiRequest.deleteChat(chatId);
      return chatId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Rename chat
export const renameChatAsyncThunk = createAsyncThunk(
  "chat/renameChatAsyncThunk",
  async ({ chatId, newTitle }, { rejectWithValue }) => {
    try {
      const res = await ApiRequest.renameChat(chatId, newTitle);
      return { chatId, title: res.data.title };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  chatList: [],
  messages: [],
  selectedChatId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessageLocally: (state, action) => {
      state.messages.push(action.payload);
    },
    selectChat: (state, action) => {
      state.selectedChatId = action.payload;
      state.messages = [];
    },
    resetChatState: (state) => {
      state.chatList = [];
      state.messages = [];
      state.selectedChatId = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatHistoryAsyncThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatHistoryAsyncThunk.fulfilled, (state, action) => {
        state.chatList = action.payload;
        state.loading = false;
      })
      .addCase(getChatHistoryAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getChatMessagesAsyncThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatMessagesAsyncThunk.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(getChatMessagesAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendMessageAsyncThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessageAsyncThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { user_message, bot_message, chat_id } = action.payload;

        if (!state.selectedChatId) {
          state.selectedChatId = chat_id;
          state.chatList.unshift({ id: chat_id, title: user_message.message });
        }

        if (bot_message) {
          state.messages.push({
            sender: "bot",
            message: bot_message.message,
          });
        }
      })
      .addCase(sendMessageAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteChatAsyncThunk.fulfilled, (state, action) => {
        const chatId = action.payload;
        state.chatList = state.chatList.filter((c) => c.id !== chatId);
        if (state.selectedChatId === chatId) {
          state.selectedChatId = null;
          state.messages = [];
        }
      })

      .addCase(renameChatAsyncThunk.fulfilled, (state, action) => {
        const { chatId, title } = action.payload;
        const chat = state.chatList.find((c) => c.id === chatId);
        if (chat) chat.title = title;
      });
  },
});

export const { addMessageLocally, selectChat, resetChatState } =
  chatSlice.actions;

export default chatSlice.reducer;
