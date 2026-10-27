const jwt = require("jsonwebtoken");
const cookie = require("cookie");
require("dotenv").config();


const socketAuthMiddleware = (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    const cookies = cookie.parse(cookieHeader || "");
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.SECRET_CODE);

    socket.userId = decoded.userId;
    socket.role = decoded.role;

    next();
} catch (error) {
  console.error("Socket JWT error:", error.message);
  next(new Error("Invalid or expired token"));
}
};

module.exports = socketAuthMiddleware;