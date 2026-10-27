const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userModel = require("./models/users.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const ticketSocket = require("./socket/ticketSocket.js");

const authRoute = require("./routes/authRoute.js");
const BookRoute = require("./routes/bookRouter.js");
const ticketRoute = require("./routes/ticketRouter.js");
const socketAuthMiddleware = require("./middleware/socketAuthMiddleware.js");

const localOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
const allowedOrigins = process.env.NODE_ENV === "production"
  ? configuredOrigins
  : [...new Set([...configuredOrigins, ...localOrigins])];
const checkOrigin = (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
    return callback(null, true);
  }
  return callback(new Error("Origin is not allowed by CORS"));
};


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: checkOrigin,
    credentials: true,
  },
});
io.use(socketAuthMiddleware);


app.set("io", io);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: checkOrigin,
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/books", BookRoute);
app.use("/api/tickets", ticketRoute);

// Basic Socket.IO connection test
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
   ticketSocket(io, socket);
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
}); 

const url = process.env.MONGODB_URI;

const start = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI must be configured");
    }
    if (!process.env.SECRET_CODE) {
      throw new Error("SECRET_CODE must be configured");
    }
    if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
      throw new Error("FRONTEND_URL must be configured in production");
    }
    await mongoose.connect(url);
    console.log("DB is connected");

    const PORT = process.env.PORT || 8080;

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exitCode = 1;
  }
};

start();
