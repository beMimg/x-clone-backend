var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cors = require("cors");
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

// session middleware
app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    secret: process.env.SESSION_SECRET,
    collection: "sessions",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
  })
);

// passport middleware
require("./controllers/local-authController");
require("./controllers/github2-authController");
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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
