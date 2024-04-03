const express = require("express");
const router = express.Router();
const usersRoute = require("./users");
const authRoute = require("./auth");

router.get("/", function (req, res, next) {
  res.status(200).send({ message: "Api route" });
});

router.use("/users", usersRoute);
router.use("/auth", authRoute);
module.exports = router;
