import { useEffect, useState } from "react";

import api from "../../services/api"
import { useAuth } from "../../context/AuthContext";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ socket, activeChat }) {

  const { user } = useAuth();

  const [messages, setMessages] = useState([]);


  // =========================
  // Load old messages
  // =========================

  useEffect(() => {

    if (!activeChat) return;

    const loadMessages = async () => {

      try {

        const response = await api.get(
          `/messages/${activeChat._id}`
        );

        setMessages(response.data.messages);

      } catch (error) {

        console.error(error);

      }

    };

    loadMessages();

  }, [activeChat]);


  // =========================
  // Join chat room
  // =========================

  useEffect(() => {

    if (!socket || !activeChat) return;

    socket.emit(
      "join_chat",
      activeChat._id
    );

  }, [socket, activeChat]);


  // =========================
  // Receive new message
  // =========================

  useEffect(() => {

    if (!socket) return;

    const handleNewMessage = (message) => {

      setMessages((prev) => [
        ...prev,
        message,
      ]);

    };

    socket.on(
      "new_message",
      handleNewMessage
    );

    return () => {

      socket.off(
        "new_message",
        handleNewMessage
      );

    };

  }, [socket]);


  // =========================
  // No active chat
  // =========================

  if (!activeChat) {

    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">
          Select a chat to start messaging
        </p>
      </div>
    );

  }


  return (
    <div className="flex-1 flex flex-col">

      {/* Header */}

      <div className="p-4 border-b">
        <h2 className="font-bold">
          Chat
        </h2>
      </div>


      {/* Messages */}

      <MessageList
        messages={messages}
        currentUserId={user?._id}
      />


      {/* Input */}

      <MessageInput
        socket={socket}
        chatId={activeChat._id}
      />

    </div>
  );
}

export default ChatWindow;