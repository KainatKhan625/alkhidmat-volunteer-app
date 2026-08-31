const router = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.put("/change-password", authenticate, authController.changePassword);

module.exports = router;