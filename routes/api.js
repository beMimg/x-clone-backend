const express = require("express");
const router = express.Router();
const usersRoute = require("./users");
const loginRoute = require("./auth");
const refreshRoute = require("./refresh");
router.get("/", function (req, res, next) {
  res.status(200).send({ message: "Api route" });
});

router.use("/users", usersRoute);
router.use("/auth", loginRoute);
router.use("/refresh", refreshRoute);

module.exports = router;
