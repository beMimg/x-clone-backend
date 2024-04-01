const express = require("express");
const router = express.Router();
const usersRoute = require("./users");

router.get("/", function (req, res, next) {
  res.status(200).send({ message: "Api route" });
});

router.use("/users", usersRoute);

module.exports = router;
