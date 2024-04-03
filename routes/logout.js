const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      res.status(200).send({ message: "Logged out" });
    }
  });
});

module.exports = router;
