const router = require("express").Router();
const registrationController = require("../controllers/registration.controller");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");


router.post("/", authenticate, registrationController.registerForEvent);
router.get("/my", authenticate, registrationController.getMyRegistrations);
router.get("/event/:eventId", authenticate, requireAdmin, registrationController.getEventRegistrations);
router.put("/:id/attendance", authenticate, requireAdmin, registrationController.markAttendance);
router.post("/scan-attendance", authenticate, requireAdmin, registrationController.scanAndMarkAttendance);

module.exports = router;