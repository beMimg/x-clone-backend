var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");
const passport = require("passport");
const upload = require("../utils/multer");

// Get all users
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  usersController.getAllUsers
);

router.get(
  "/top",
  passport.authenticate("jwt", { session: false }),
  usersController.getTopUsers
);

// Get specific user
router.get(
  "/self",
  passport.authenticate("jwt", { session: false }),
  usersController.getSelf
);

router.post("/", usersController.create);

router.put(
  "/profile_pic",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  usersController.updateProfilePic
);

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

router.get(
  "/:user_id",
  passport.authenticate("jwt", { session: false }),
  usersController.getUser
);

router.get(
  "/:user_id/following",
  passport.authenticate("jwt", { session: false }),
  usersController.getUserFollowings
);

router.get(
  "/:user_id/followers",
  passport.authenticate("jwt", { session: false }),
  usersController.getUserFollowers
);

module.exports = router;
