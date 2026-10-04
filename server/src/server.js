import express from "express";
import cors from "cors"

import {createServer} from "http"
import { Server } from "socket.io";
import {initializeSocket} from "./socket/socket.js"

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"
import messageRoutes from "./routes/message.routes.js"
import chatRoutes from "./routes/chat.routes.js";

import dotenv from "dotenv"

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes)
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);


//http server 
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,    
  },
});

initializeSocket(io);

//PORT
const PORT = process.env.PORT ;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
