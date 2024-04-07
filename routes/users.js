var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");
const passport = require("passport");

// Get all users
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  usersController.getAllUsers
);

// Get specific user
router.get(
  "/:user_id",
  passport.authenticate("jwt", { session: false }),
  usersController.getUser
);

// Create a user
router.post("/", usersController.create);

// Create a follow
router.post(
  "/follow/:user_id",
  passport.authenticate("jwt", { session: false }),
  usersController.followUser
);

// Delete a follow
router.delete(
  "/follow/:user_id",
  passport.authenticate("jwt", { session: false }),
  usersController.deleteFollow
);

module.exports = router;
