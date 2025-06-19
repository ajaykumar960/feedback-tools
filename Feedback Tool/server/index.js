import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import socketIo from "socket.io";
import dotenv from "dotenv";

import feedbackRoutes from "./routes/feedback.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

app.use("/api/feedback", feedbackRoutes(io));
app.use("/api/admin", adminRoutes);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
