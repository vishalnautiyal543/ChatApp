import { useState } from "react";

function MessageInput({ socket, chatId }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    socket.emit("send_message", {
      chatId,
      content,
    });

    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t flex gap-2"
    >
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded px-3 py-2"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-5 py-2 rounded"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;