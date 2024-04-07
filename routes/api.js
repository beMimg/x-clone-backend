const express = require("express");
const router = express.Router();
const usersRoute = require("./users");
const authRoute = require("./auth");
const postsRoute = require("./posts");
const passport = require("passport");
const logoutRoute = require("./logout");

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

router.use("/logout", logoutRoute);

module.exports = router;
