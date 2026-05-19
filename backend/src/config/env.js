const dotenv = require("dotenv");
dotenv.config();

function required(name) {
  if (!process.env[name]) {
    throw new Error(
      `Environment variable ${name} is required but not defined.`,
    );
  }
  return process.env[name];
}
function optional(name, defaultValue) {
  return process.env[name] || defaultValue;
}

const ENV = {
  PORT: optional("PORT", 5000),
  CLIENT_URL: optional("CLIENT_URL", "http://localhost:5173"),
  NODE_ENV: optional("NODE_ENV", "development"),
  MONGO_URI: required("MONGO_URI"),
  appName: optional("appName", "legal-olympiad"),
  REDIS_HOST: required("REDIS_HOST"),
  REDIS_PORT: required("REDIS_PORT"),
  REDIS_PASSWORD: optional("REDIS_PASSWORD", ""),
  BREVO_API_KEY: required("BREVO_API_KEY"),
  EMAIL_FROM: required("EMAIL_FROM"),
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_EXPIRES_IN: required("JWT_EXPIRES_IN"),
};

module.exports = { ENV };
