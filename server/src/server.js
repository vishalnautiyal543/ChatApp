import express from "express";
import cors from "cors"

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

import dotenv from "dotenv"

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get('/',(req,res)=>{
    res.json({"message":"hello"})
})

//PORT
const PORT = process.env.PORT ;


const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();
