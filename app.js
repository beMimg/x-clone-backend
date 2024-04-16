var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

// routes
const apiRouter = require("./routes/api");

var app = express();

// connection to database
async function main(req, res, next) {
  try {
    console.log("connecting to database");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("should be connected to database");
  } catch {
    return next(err);
  }
}

main();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// passport middleware
require("./controllers/github2-authController");
require("./controllers/jwt-authController");

app.use(passport.initialize());

const allowedDomains = ["http://localhost:5173", "http://localhost:4173"];
app.use(cors({ credentials: true, origin: allowedDomains }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression()); // Compress all routes
app.use(helmet());
// API route
app.use("/api", apiRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
