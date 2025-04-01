const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");


// User routes
router.get("/profile", userController.getProfile);
router.put("/change-password", userController.changePassword);



module.exports = router;
