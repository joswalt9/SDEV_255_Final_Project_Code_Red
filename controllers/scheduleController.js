const User = require("../models/User");
const Course = require("../models/course");
const Schedule = require("../models/Schedule"); // Import the Schedule model

// Add course to schedule
const addCourseToSchedule = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    // Check if the schedule exists for the user
    let schedule = await Schedule.findOne({ user: req.user._id });

    if (!schedule) {
      // Create a new schedule if it doesn't exist
      schedule = new Schedule({ user: req.user._id, courses: [] });
    }

    // Check if the course is already in the schedule
    if (schedule.courses.includes(courseId)) {
      return res.redirect("/schedule");
    }

    schedule.courses.push(courseId);
    await schedule.save();

    // Redirect to the schedule page after adding the course
    res.redirect("/schedule");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove course from schedule
const removeCourseFromSchedule = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    let schedule = await Schedule.findOne({ user: req.user._id });

    if (!schedule) {
      return res.redirect("/schedule");
    }

    // Filter out the course from the schedule
    schedule.courses = schedule.courses.filter(
      (course) => course.toString() !== courseId
    );
    await schedule.save();

    // Redirect to the schedule page after removing the course
    res.redirect("/schedule");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// View Schedule
const getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ user: req.user._id }).populate(
      "courses"
    );

    if (!schedule) {
      return res.status(404).render("schedule", { courses: [] });
    }

    res.render("schedule", { courses: schedule.courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addCourseToSchedule,
  removeCourseFromSchedule,
  getSchedule,
};
