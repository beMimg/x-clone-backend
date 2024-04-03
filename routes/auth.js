const express = require("express");
const passport = require("passport");
const { authenticate } = require("passport");
const router = express.Router();

router.post("/", passport.authenticate("local"), (req, res) => {
  res.status(200).send({ message: "Authenticated" });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.json({ message: "Authenticated" });
  }
);

module.exports = router;
