import { useEffect, useState } from "react";
import { createSocket } from "../socket/socket";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";

function Chat() {

  const [socket, setSocket] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {

    const newSocket = createSocket();

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error(
        "Socket error:",
        error.message
      );
    });

    return () => {
      newSocket.disconnect();
    };

  }, []);


  return (
    <div className="h-screen flex">

      <ChatSidebar
        onSelectChat={setActiveChat}
      />

      <ChatWindow
        socket={socket}
        activeChat={activeChat}
      />

    </div>
  );
}

export default Chat;