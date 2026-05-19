const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { ENV } = require("./env");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ENV.CLIENT_URL || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");
    if (!token) return next(new Error("Unauthorized"));
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.userId) {
      socket.join(socket.userId.toString());
    }

    socket.on("join", (userId) => {
      if (userId && userId.toString() === socket.userId?.toString()) {
        socket.join(userId.toString());
      }
    });
  });

  return io;
};

const emitToUser = (userId, event, payload) => {
  if (io) {
    io.to(userId.toString()).emit(event, payload);
  }
};

const emitToAll = (event, payload) => {
  if (io) {
    io.emit(event, payload);
  }
};

module.exports = {
  initSocket,
  emitToUser,
  emitToAll,
};
