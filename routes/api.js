const express = require("express");
const router = express.Router();
const usersRoute = require("./users");
const loginRoute = require("./login");

router.get("/", function (req, res, next) {
  res.status(200).send({ message: "Api route" });
});

router.use("/users", usersRoute);
router.use("/login", loginRoute);

module.exports = router;
