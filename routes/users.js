var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");
const isAuthenticated = require("../middleware/isAuthenticated");

// Get all users
router.get("/", isAuthenticated, usersController.getAllUsers);

// Get specific user
router.get("/:user_id", isAuthenticated, usersController.getUser);

// Create a user
router.post("/", usersController.create);

// Create a follow
router.post("/follow/:user_id", isAuthenticated, usersController.followUser);

module.exports = router;
