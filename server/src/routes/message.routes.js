import express from "express";

import {
  sendMessage,
  getMessages,
} from "../controllers/message.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  sendMessage
);

router.get(
  "/:chatId",
  authMiddleware,
  getMessages
);

export default router;