import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

export const createMessage = async ({
  userId,
  chatId,
  content,
}) => {
  if (!chatId || !content?.trim()) {
    throw new Error("chatId and content are required");
  }

  // Find chat
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  // Check membership
  const isMember = chat.users.some(
    (memberId) =>
      memberId.toString() === userId.toString()
  );

  if (!isMember) {
    throw new Error(
      "You are not a member of this chat"
    );
  }

  // Create message
  let message = await Message.create({
    sender: userId,
    chat: chatId,
    content: content.trim(),
  });

  // Populate required data
  message = await Message.findById(message._id)
    .populate("sender", "name email avatar")
    .populate("chat");

  // Update latest message
  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: message._id,
  });

  return message;
};