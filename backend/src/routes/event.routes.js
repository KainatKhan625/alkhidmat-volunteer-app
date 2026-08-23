const router = require("express").Router();
const eventController = require("../controllers/event.controller");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");

// Public routes (anyone logged in can view)
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

// Admin-only routes
router.post("/", authenticate, requireAdmin, eventController.createEvent);
router.put("/:id", authenticate, requireAdmin, eventController.updateEvent);
router.delete("/:id", authenticate, requireAdmin, eventController.deleteEvent);

module.exports = router;