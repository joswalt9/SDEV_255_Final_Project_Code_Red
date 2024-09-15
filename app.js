const express = require("express");
const app = express();
const PORT = 3000;

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

// Course Placeholder
let courses = [];

// Get Homepage
app.get("/", (req, res) => {
  res.render("index");
});

// Get Add Course page
app.get("/addcourse", (req, res) => {
  res.render("addcourse");
});

// 404 Page (Must be at the bottom of code)
app.use((req, res) => {
  res.status(404).render("404");
});
