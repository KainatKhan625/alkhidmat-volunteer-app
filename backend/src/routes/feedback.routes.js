const router = require("express").Router();
const feedbackController = require("../controllers/feedback.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/", authenticate, feedbackController.submitFeedback);
router.get("/event/:eventId", feedbackController.getEventFeedback);

module.exports = router;