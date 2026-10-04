import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import { createMessage } from "../service/message.service.js";


// send messages
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    const message = await createMessage({
      userId: req.user.userId,
      chatId,
      content,
    });

    return res.status(201).json({
      message,
    });

  } catch (error) {
    console.error(error);

    if (error.message === "chatId and content are required") {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (error.message === "Chat not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (
      error.message ===
      "You are not a member of this chat"
    ) {
      return res.status(403).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



//get messages
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const isMember = chat.users.some(
      (userId) =>
        userId.toString() === req.user.userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this chat",
      });
    }

    const messages = await Message.find({
      chat: chatId,
    })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { getMessages}