const mongoose = require("mongoose");
const { ENV } = require("./env");
const dns = require("dns");

// add google public DNS to avoid potential MongoDB connection issues in some environments
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  const conn = await mongoose.connect(ENV.MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;