var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, usersController.getAllUsers);

router.post("/", usersController.create);

module.exports = router;
