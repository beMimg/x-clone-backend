const express = require("express");
const router = express.Router();
const usersRoute = require("./users");
const authRoute = require("./auth");
const logoutRoute = require("./logout");

router.get("/", function (req, res, next) {
  res.status(200).send({ message: "Api route" });
});

router.use("/users", usersRoute);
router.use("/auth", authRoute);
router.use("/logout", logoutRoute);

module.exports = router;
