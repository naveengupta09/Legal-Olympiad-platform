const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const passport = require("./config/passport");

const routes = require("./routes/index");
const { errorHandler, notFound } = require("./middleware/error.middleware");
const { ENV } = require("./config/env");

const app = express();

app.use(helmet());
app.use(cors({ origin: [
  ENV.CLIENT_URL, 
  "https://legal-olympiad.vercel.app",
  "http://localhost:5174",
  "http://localhost:5175",
], credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(passport.initialize());

if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", routes);
app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;