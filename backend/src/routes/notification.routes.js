const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/", authenticate, notificationController.getMyNotifications);
router.get("/unread-count", authenticate, notificationController.getUnreadCount);
router.put("/mark-all-read", authenticate, notificationController.markAllAsRead);

module.exports = router;