const express = require("express");
const User = require("../models/user");
const passport = require("passport");

const router = express.Router();

// Auth Routes
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, err => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", `Welcome to the team, ${newUser.username}!`);
      res.redirect("/campgrounds");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "See you next time!");
  res.redirect("/");
});

module.exports = router;
