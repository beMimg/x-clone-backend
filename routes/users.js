var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.getAllUsers);

router.post("/", usersController.create);

module.exports = router;
