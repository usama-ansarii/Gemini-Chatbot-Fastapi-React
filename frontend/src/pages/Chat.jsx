import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FiSend,
  FiSettings,
  FiLogOut,
  FiUser,
  FiMenu,
  FiPlus,
} from "react-icons/fi";
import Drawer from "@mui/material/Drawer";
import { useDispatch, useSelector } from "react-redux";
import {
  getChatHistoryAsyncThunk,
  getChatMessagesAsyncThunk,
  sendMessageAsyncThunk,
  selectChat,
  addMessageLocally,
  resetChatState,
  deleteChatAsyncThunk,
  renameChatAsyncThunk,
} from "../store/slices/chatSlice";
import { resetAuthState } from "../store/slices/authSlice";
import MessageSkeleton from "../components/MessageSkeleton";
import { BsThreeDots } from "react-icons/bs";
import ChatOptionsPopover from "../components/ChatOptionsPopover";
import ReactMarkdown from "react-markdown";
import Logo from "../components/Logo";
import { toast } from "react-toastify";
import { ApiRequest } from "../services/ApiRequest";

const Chat = () => {
  const [input, setInput] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [popoverChatId, setPopoverChatId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { chatList, messages, selectedChatId, loading } = useSelector(
    (state) => state.chat
  );

  const dispatch = useDispatch();
  const chatBodyRef = useRef(null);

  // ✅ Load current user's chats
  useEffect(() => {
    if (user?.user_id) {
      dispatch(getChatHistoryAsyncThunk(user.user_id));
    }
  }, [dispatch, user?.user_id]);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      user_id: user?.user_id,
      chat_id: selectedChatId || null,
      sender: "user",
      message: input,
    };

    try {
      dispatch(addMessageLocally(newMsg));
      const resultAction = await dispatch(sendMessageAsyncThunk(newMsg));

      if (sendMessageAsyncThunk.rejected.match(resultAction)) {
        toast.error(resultAction.payload || "Failed to send message!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }

    setInput("");
  };

  // ✅ Select chat
  const handleSelectChat = (chat) => {
    dispatch(selectChat(chat.id));
    dispatch(getChatMessagesAsyncThunk(chat.id));
  };

  // ✅ New chat
  const handleNewChat = () => {
    dispatch(selectChat(null));
    setInput("");
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await ApiRequest.logout();
      dispatch(resetAuthState());
      dispatch(resetChatState());
      localStorage.clear();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout. Try again!");
    }
  };

  return (
    <Container fluid className="chat-page">
      <Row className="chat-row gy-0">
        {/* ===== Sidebar ===== */}
        <Col xs={12} md={3} className="sidebar d-none d-md-flex flex-column">
          <div className="sidebar-top">
            <Logo />
            <div className="new-chat-btn" onClick={handleNewChat}>
              <FiPlus /> New Chat
            </div>
            <div className="chat-history mt-4">
              <h6>Chat History</h6>
              <ul>
                {chatList.length > 0 ? (
                  chatList.map((chat) => (
                    <li
                      key={chat.id}
                      className={`chat-item ${
                        selectedChatId === chat.id ? "active" : ""
                      }`}
                      onClick={() => handleSelectChat(chat)}
                      style={{ position: "relative" }}
                    >
                      <span className="chat-title">
                        {chat.title || "Untitled Chat"}
                      </span>
                      <span
                        className="chat-options"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopoverAnchor(e.currentTarget);
                          setPopoverChatId(chat.id);
                        }}
                      >
                        <BsThreeDots />
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted">No chats yet</li>
                )}
              </ul>

              <ChatOptionsPopover
                anchorEl={popoverAnchor}
                open={Boolean(popoverAnchor)}
                onClose={() => setPopoverAnchor(null)}
                onDelete={async () => {
                  if (
                    window.confirm("Are you sure you want to delete this chat?")
                  ) {
                    const result = await dispatch(
                      deleteChatAsyncThunk(popoverChatId)
                    );
                    if (deleteChatAsyncThunk.fulfilled.match(result)) {
                      toast.success("Chat deleted!");
                      if (selectedChatId === popoverChatId) {
                        dispatch(selectChat(null));
                      }
                    } else {
                      toast.error("Failed to delete chat!");
                    }
                    setPopoverAnchor(null);
                  }
                }}
                onRename={async () => {
                  const chat = chatList.find((c) => c.id === popoverChatId);
                  const newTitle = prompt("Enter new chat title:", chat?.title);
                  if (newTitle) {
                    const result = await dispatch(
                      renameChatAsyncThunk({ chatId: chat.id, newTitle })
                    );
                    if (renameChatAsyncThunk.fulfilled.match(result)) {
                      toast.success("Chat renamed!");
                    } else {
                      toast.error("Failed to rename chat!");
                    }
                    setPopoverAnchor(null);
                  }
                }}
              />
            </div>
          </div>

          <div className="sidebar-bottom mt-auto">
            <div className="sidebar-btn">
              <FiSettings /> Settings
            </div>
            <div className="sidebar-btn" onClick={handleLogout}>
              <FiLogOut /> Logout
            </div>
          </div>
        </Col>

        {/* ===== Chat Area ===== */}
        <Col xs={12} md={9} className="chat-area">
          <div className="chat-navbar">
            <div className="d-flex align-items-center gap-3">
              <FiMenu
                size={24}
                className="burger-icon d-md-none"
                onClick={() => setDrawerOpen(true)}
              />
              <h5 className="gradient-text m-0">ChatVerse AI</h5>
            </div>
            <div className="user-icon">
              <FiUser />
            </div>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.length === 0 && !loading && (
              <p className="text-center text-muted mt-5">
                {selectedChatId
                  ? `No messages yet in this chat`
                  : `Hello,`}
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message-bubble ${
                  msg.sender === "user" ? "user-msg" : "bot-msg"
                }`}
              >
                {msg.sender === "bot" ? (
                  <ReactMarkdown>{msg.message}</ReactMarkdown>
                ) : (
                  msg.message
                )}
              </div>
            ))}
            {loading && <MessageSkeleton />} {/* ✅ Skeleton loader */}
          </div>

          <form className="chat-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              <FiSend />
            </button>
          </form>
        </Col>
      </Row>

      {/* ===== Mobile Sidebar ===== */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div
          className="mobile-sidebar d-flex flex-column p-3"
          style={{ width: 280, height: "100%" }}
        >
          {/* Top Section */}
          <div className="sidebar-top">
            <Logo className="gradient-text" />
            <div className="new-chat-btn mt-3" onClick={handleNewChat}>
              <FiPlus /> New Chat
            </div>

            <div className="chat-history mt-4">
              <h6>Chat History</h6>
              <ul className="p-0 m-0" style={{ listStyle: "none" }}>
                {chatList.length > 0 ? (
                  chatList.map((chat) => (
                    <li
                      key={chat.id}
                      className="chat-item"
                      onClick={() => {
                        handleSelectChat(chat);
                        setDrawerOpen(false);
                      }}
                    >
                      {chat.title || "Untitled Chat"}
                    </li>
                  ))
                ) : (
                  <li className="text-muted">No chats yet</li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="sidebar-bottom mt-auto">
            <div className="sidebar-btn">
              <FiSettings /> Settings
            </div>
            <div className="sidebar-btn" onClick={handleLogout}>
              <FiLogOut /> Logout
            </div>
          </div>
        </div>
      </Drawer>
    </Container>
  );
};

export default Chat;
