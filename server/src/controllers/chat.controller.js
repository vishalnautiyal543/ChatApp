import Chat from "../models/chat.model.js";
import {User} from "../models/user.model.js";

export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    // Cannot chat with yourself
    if (userId === req.user.userId.toString()) {
      return res.status(400).json({
        message: "You cannot create a chat with yourself",
      });
    }

    // Check target user
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: {
        $all: [req.user.userId, userId],
      },
    })
      .populate("users", "name email avatar")
      .populate("latestMessage");

    if (chat) {
      return res.status(200).json({
        chat,
      });
    }

    // Create new chat
    chat = await Chat.create({
      isGroupChat: false,
      users: [
        req.user.userId,
        userId,
      ],
    });

    // Populate users
    chat = await Chat.findById(chat._id)
      .populate("users", "name email avatar");

    return res.status(201).json({
      chat,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};