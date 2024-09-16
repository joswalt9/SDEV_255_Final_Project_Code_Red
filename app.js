const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs");
const path = require("path");
const coursesFilePath = path.join(__dirname, "courses.json");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static("public"));

// Register View Engine
app.set("view engine", "ejs");

// Listen for Requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Get Courses Function
function getCourses() {
  if (fs.existsSync(coursesFilePath)) {
    const data = fs.readFileSync(coursesFilePath, "utf8");
    return JSON.parse(data);
  }
  return [];
}

// Save Courses Function
function saveCourses(courses) {
  fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2), "utf8");
}

// Get Individual Course
app.get("/course/:index", (req, res) => {
  const courses = getCourses();
  const courseIndex = parseInt(req.params.index, 10);

  console.log(`Requested course index: ${courseIndex}`); // Debug Line

  if (courseIndex >= 0 && courseIndex < courses.length) {
    const course = courses[courseIndex];
    res.render("course", { course });
  } else {
    res.status(404).render("404");
  }
});

// Add Course
app.post("/addcourse", (req, res) => {
  const courses = getCourses();
  const newCourse = {
    name: req.body.name,
    description: req.body.description,
    subject: req.body.subject,
    credits: req.body.credits,
  };
  courses.push(newCourse);
  saveCourses(courses);
  res.redirect("/");
});

// Get Homepage
app.get("/", (req, res) => {
  const courses = getCourses(); // Fetch the updated courses from the JSON file
  res.render("index", { courses });
});

// Get Add Course page
app.get("/addcourse", (req, res) => {
  res.render("addcourse");
});

// 404 Page (Must be at the bottom of code)
app.use((req, res) => {
  res.status(404).render("404");
});
