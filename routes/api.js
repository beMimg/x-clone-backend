const express = require("express");
const router = express.Router();
const usersRoute = require("./users");
const authRoute = require("./auth");
const postsRoute = require("./posts");
const passport = require("passport");

router.get("/", function (req, res, next) {
  res.status(200).json({ message: "Api route" });
});

router.use("/users", usersRoute);

router.use("/auth", authRoute);

router.use(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  postsRoute
);

module.exports = router;
