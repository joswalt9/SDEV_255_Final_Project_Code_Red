const express = require("express");
const router = express.Router();
const {
  addCourseToSchedule,
  removeCourseFromSchedule,
  getSchedule,
} = require("../controllers/scheduleController");
const { requireAuth } = require("../middleware/authMiddleware");

// Add course to schedule
router.post("/schedule/add", requireAuth, addCourseToSchedule);

// Remove course from schedule
router.post("/schedule/remove", requireAuth, removeCourseFromSchedule);

// View schedule
router.get("/schedule", requireAuth, getSchedule);

module.exports = router;
