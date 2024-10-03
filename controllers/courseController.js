const Course = require("../models/course");

// Get Individual Course
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.render("course", { course });
    } else {
      res.status(404).render("404");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Add Course
const addCourse = async (req, res) => {
  const newCourse = new Course({
    name: req.body.name,
    description: req.body.description,
    subject: req.body.subject,
    credits: req.body.credits,
  });

  try {
    await newCourse.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Delete Course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (course) {
      res.status(200).json({ redirect: "/" });
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Edit Course Page
const getEditCoursePage = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.render("editcourse", { course });
    } else {
      res.status(404).render("404");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Update Course
const updateCourse = async (req, res) => {
  try {
    const updatedCourse = {
      name: req.body.name,
      description: req.body.description,
      subject: req.body.subject,
      credits: req.body.credits,
    };

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updatedCourse,
      {
        new: true,
      }
    );

    if (course) {
      res.redirect(`/course/${course._id}`);
    } else {
      res.status(404).send("Course not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("allcourses", { courses });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getCourseById,
  addCourse,
  deleteCourse,
  getEditCoursePage,
  updateCourse,
  getAllCourses,
};
