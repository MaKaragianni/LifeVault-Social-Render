const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ROUTES
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const authenticationRouter = require("./routes/authentication");

const friendsRouter = require("./routes/friends");
const friendRequestRouter = require("./routes/friendRequests");
const passwordResetRouter = require("./routes/passwordReset");

const tokenChecker = require("./middleware/tokenChecker");

const app = express();

// SECURITY MIDDLEWARE
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORE MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());

// PUBLIC ROUTES
app.use("/users", usersRouter);
app.use("/tokens", authenticationRouter);

// PROTECTED ROUTES
app.use("/posts", tokenChecker, postsRouter);
app.use("/friends", tokenChecker, friendsRouter);
app.use("/friendRequests", tokenChecker, friendRequestRouter);
app.use("/passwordReset", passwordResetRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ err: "Not Found" });
});

// ERROR HANDLER
app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    err: "Something went wrong",
  });
});

module.exports = app;