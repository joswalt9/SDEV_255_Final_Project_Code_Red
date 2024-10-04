const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check json web token exists and is verified
  if (token) {
    jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        // Attach user to request
        const user = await User.findById(decodedToken.id);
        req.user = user; // Attach user to request
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// Check if current user is a teacher
const requireTeacher = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        const user = await User.findById(decodedToken.id);
        if (user && user.isTeacher) {
          req.user = user; // Attach user to request
          next();
        } else {
          // If the user is not a teacher, deny access
          res.status(403).send("Access denied: Teachers only");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
};

// Check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser, requireTeacher };
