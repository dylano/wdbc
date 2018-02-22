var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    seedDB = require('./seed.js'),
    expressSession = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOverride = require('method-override');


// app config
var PORT = process.env.PORT || 3000;
app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

var dbconnect = process.env.MONGODB_URI || "mongodb://localhost/stuts";
console.log("Connecting to Mongo: " + dbconnect);
mongoose.connect(dbconnect);

// Auth / Passport config
var User = require('./models/user');
app.use(require('express-session')({
    secret: 'blue skies at night',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Load current user into responses
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// seedDB();

// ROUTES
app.get('/', function (req, res) {
    res.render('landing');
});

app.use(require('./routes/auth.js'));
app.use(require('./routes/campgrounds.js'));
app.use(require('./routes/comments.js'));

// Let's go!
app.listen(PORT, function () {
    console.log("Now camping on " + PORT + "...");
});

module.exports = {
    sanityTest: function () {
        return true;
    }
}