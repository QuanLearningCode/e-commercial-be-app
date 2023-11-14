const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);
router.get("/logout", authController.getLogout);
router.get("/session", authController.checkSession);

module.exports = router;
