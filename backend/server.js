const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { connectRedis } = require("./src/config/redis");
const { initSocket } = require("./src/config/socket");

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

// Init Socket.io on the same HTTP server
initSocket(httpServer);

const start = async () => {
  await connectDB();
  await connectRedis();
  httpServer.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    console.log(`🔌 WebSocket server ready`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});