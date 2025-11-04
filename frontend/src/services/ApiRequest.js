import { APIurls } from "../constants";
import { apiServices } from "./ApiServices";

export const ApiRequest = {
  login: async (data) => await apiServices.post(APIurls.login, data),
  signup: async (data) => await apiServices.post(APIurls.signup, data),
  sendMessage: async (payload) =>
    await apiServices.post(APIurls.chatSend, payload),
  getChatHistory: async (userId) =>
    await apiServices.get(`${APIurls.chatHistory}/${userId}`),
  getChatMessages: async (chatId) =>
    await apiServices.get(`${APIurls.chatMessages}/${chatId}`),
  deleteChat: async (chatId) =>
    await apiServices.delete(`${APIurls.deleteChat}/${chatId}`),
  renameChat: async (chatId, newTitle) =>
    await apiServices.patch(`${APIurls.renameChat}/${chatId}`, {
      title: newTitle,
    }),
  logout: async () => {
    return await apiServices.post(APIurls.logout, {});
  },
};
