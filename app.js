const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const courseController = require("./controllers/courseController");

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

// Static Files
app.use(express.static("public"));

// Register View Engine
app.set("view engine", "ejs");

// Routes for Courses
app.get("/course/:id", courseController.getCourseById);
app.post("/addcourse", courseController.addCourse);
app.delete("/course/:id", courseController.deleteCourse);
app.get("/course/edit/:id", courseController.getEditCoursePage);
app.post("/course/edit/:id", courseController.updateCourse);
app.get("/allcourses", courseController.getAllCourses);

// Get Homepage
app.get("/", (req, res) => {
  res.render("index");
});

// Get All Courses Page
app.get("/allcourses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("allcourses", { courses });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Get Add Course page
app.get("/addcourse", (req, res) => {
  res.render("addcourse");
});

// 404 Page (Must be at the bottom of code)
app.use((req, res) => {
  res.status(404).render("404");
});
