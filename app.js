const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const seedDB = require("./seed.js");
const expressSession = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const User = require("./models/user");

// app config
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

const dbconnect = process.env.MONGODB_URI || "mongodb://localhost/stuts";
console.log(`Connecting to Mongo: ${dbconnect}`);
mongoose.connect(dbconnect).catch(err => {
  console.log(`fatal: could not connect to mongo:\n${err}`);
  process.exit(1);
});

// Auth / Passport config
app.use(
  expressSession({
    secret: "blue skies at night",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up values to be available on all pages
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errorFlash = req.flash("errorFlash");
  res.locals.successFlash = req.flash("successFlash");
  res.locals.infoFlash = req.flash("infoFlash");
  next();
});

// seedDB();

// ROUTES
app.get("/", (req, res) => {
  res.render("landing");
});

app.use(require("./routes/auth.js"));
app.use(require("./routes/campgrounds.js"));
app.use(require("./routes/comments.js"));

// Let's go!
app.listen(PORT, () => {
  console.log(`Now camping on ${PORT}...`);
});

module.exports = {
  sanityTest() {
    return true;
  }
};
