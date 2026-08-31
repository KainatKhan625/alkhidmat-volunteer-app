const router = require("express").Router();
const feedbackController = require("../controllers/feedback.controller");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");

router.post("/", authenticate, feedbackController.submitFeedback);
router.get("/event/:eventId", feedbackController.getEventFeedback);
router.get("/all", authenticate, requireAdmin, feedbackController.getAllFeedback);

module.exports = router;