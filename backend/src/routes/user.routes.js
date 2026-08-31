const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");


router.get("/pending", authenticate, requireAdmin, userController.getPendingVolunteers);
router.put("/:id/approve", authenticate, requireAdmin, userController.approveVolunteer);
router.put("/:id/reject", authenticate, requireAdmin, userController.rejectVolunteer);
router.get("/leaderboard", userController.getLeaderboard);
router.post("/profile-picture", authenticate, upload.single("image"), userController.uploadProfilePicture);
router.get("/dashboard-stats", authenticate, requireAdmin, userController.getDashboardStats);
router.get("/volunteers", authenticate, requireAdmin, userController.getAllVolunteers);

module.exports = router;