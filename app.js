const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const Course = require("./models/course");

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

// Get Individual Course
app.get("/course/:id", async (req, res) => {
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
});

// Add Course
app.post("/addcourse", async (req, res) => {
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
});

// Delete a course
app.delete("/course/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (course) {
      res.status(200).json({ redirect: "/" }); // Redirect to homepage after deletion
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Edit course
app.get("/course/edit/:id", async (req, res) => {
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
});

// Update course
app.post("/course/edit/:id", async (req, res) => {
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
      { new: true }
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
});

// Get Homepage
app.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("index", { courses });
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
