export const basePath =
  process.env.REACT_APP_BASE_PATH || "http://127.0.0.1:8000";

export const APIurls = {
  login: "/auth/login",
  signup: "/auth/signup",
  chatSend: "/chat/send",
  chatHistory: "/chat/history",
  chatMessages: "/chat/messages",
  deleteChat: "/chat/delete",
  renameChat: "/chat/rename",
  logout: "/auth/logout",
};
