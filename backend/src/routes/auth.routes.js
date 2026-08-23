const router = require("express").Router();
const authController = require("../controllers/auth.controller");
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;