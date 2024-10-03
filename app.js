const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const courseController = require("./controllers/courseController");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const {
  requireAuth,
  checkUser,
  requireTeacher,
} = require("./middleware/authMiddleware");

// Connect to MongoDB
const dbURI =
  "mongodb+srv://netninja:test1234@nodetuts.spyxg.mongodb.net/collegecourse?retryWrites=true&w=majority";

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(
        `Connected to DB and Server is running on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Check current user on all requests
app.use("*", checkUser);

// Static Files
app.use(express.static("public"));

// Register View Engine
app.set("view engine", "ejs");

// Authentication Routes
app.use(authRoutes);

// Routes for Courses

// Public route (view course by ID)
app.get("/course/:id", requireAuth, courseController.getCourseById);

// Teacher-protected routes (add, edit, delete courses)
app.post("/addcourse", requireAuth, requireTeacher, courseController.addCourse);
app.delete(
  "/course/:id",
  requireAuth,
  requireTeacher,
  courseController.deleteCourse
);
app.get(
  "/course/edit/:id",
  requireAuth,
  requireTeacher,
  courseController.getEditCoursePage
);
app.post(
  "/course/edit/:id",
  requireAuth,
  requireTeacher,
  courseController.updateCourse
);

// Public route for viewing all courses
app.get("/allcourses", courseController.getAllCourses);

// Get Homepage
app.get("/", (req, res) => {
  res.render("index");
});

// Get Add Course page (protected for teachers)
app.get("/addcourse", requireAuth, requireTeacher, (req, res) => {
  res.render("addcourse");
});

// 404 Page (Must be at the bottom of code)
app.use((req, res) => {
  res.status(404).render("404");
});
