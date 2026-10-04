function MessageList({ messages, currentUserId }) {
  return (
    <div className="flex-1 p-4 overflow-y-auto">

      {messages.map((message) => {

        const isMine =
          message.sender._id === currentUserId;

        return (
          <div
            key={message._id}
            className={`mb-3 flex ${
              isMine
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                isMine
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {!isMine && (
                <p className="text-xs font-semibold mb-1">
                  {message.sender.name}
                </p>
              )}

              <p>{message.content}</p>

              <p className="text-xs opacity-70 mt-1">
                {new Date(
                  message.createdAt
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      })}

    </div>
  );
}

export default MessageList;