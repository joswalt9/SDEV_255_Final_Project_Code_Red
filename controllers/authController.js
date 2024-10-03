const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Handle Errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let error = { email: "", password: "" };

  // Incorrect email
  if (err.message === "Incorrect email") {
    error.email = "That email is not registered.";
  }
  if (err.message === "Incorrect password") {
    error.password = "That password is incorrect.";
  }

  // Duplicate error code
  if (err.code === 11000) {
    error.email = "That email is already registered.";
    return error;
  }

  // Validation Errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }

  return error;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", {
    expiresIn: maxAge,
  });
};

// GET
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

// POST
module.exports.signup_post = async (req, res) => {
  const { email, password, isTeacher } = req.body;

  try {
    const user = await User.create({ email, password, isTeacher: !!isTeacher });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password, isTeacher } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
