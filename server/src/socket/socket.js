import jwt from "jsonwebtoken";
import Chat from "../models/chat.model.js";


import { createMessage } from "../service/message.service.js";

export const initializeSocket = (io) => {

  // =========================
  // Authentication
  // =========================

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(
          new Error("Authentication required")
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.userId = decoded.userId;

      next();

    } catch (error) {
      next(
        new Error("Invalid or expired token")
      );
    }
  });


  // =========================
  // Connection
  // =========================

  io.on("connection", (socket) => {

    console.log(
      "Socket connected:",
      socket.id,
      "User:",
      socket.userId
    );


    // =========================
    // Join Chat
    // =========================

    socket.on("join_chat", async (chatId) => {

      try {

        const chat = await Chat.findOne({
          _id: chatId,
          users: socket.userId,
        });

        if (!chat) {
          socket.emit("socket_error", {
            message:
              "You are not a member of this chat",
          });

          return;
        }

        socket.join(chatId);

        console.log(
          `User ${socket.userId} joined ${chatId}`
        );

      } catch (error) {

        console.error(error);

        socket.emit("socket_error", {
          message: "Unable to join chat",
        });

      }
    });


    // =========================
    // Send Message
    // =========================

    socket.on("send_message", async (data) => {

      try {

        const { chatId, content } = data;

        const message = await createMessage({
          userId: socket.userId,
          chatId,
          content,
        });

        io.to(chatId).emit(
          "new_message",
          message
        );

      } catch (error) {

        console.error(error);

        socket.emit("message_error", {
          message: error.message,
        });

      }
    });


    // =========================
    // Disconnect
    // =========================

    socket.on("disconnect", () => {

      console.log(
        "Socket disconnected:",
        socket.id
      );

    });

  });
};