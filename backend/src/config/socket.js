const { Server } = require("socket.io");
const { ENV } = require("./env");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ENV.CLIENT_URL || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      if (userId) {
        socket.join(userId.toString());
      }
    });

    socket.on("disconnect", () => {
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
