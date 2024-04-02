var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", verifyJWT, usersController.getAllUsers);

router.post("/", usersController.create);

module.exports = router;
