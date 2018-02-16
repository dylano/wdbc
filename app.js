var express = require('express'),
     bodyParser = require('body-parser'),
     mongoose = require('mongoose'),
     seedDB = require('./seed.js'),
     expressSession = require('express-session'),
     passport = require('passport'),
     LocalStrategy = require('passport-local'),
     passportLocalMongoose = require('passport-local-mongoose');
     
// app config
var PORT = 3000;
app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Data config
mongoose.connect("mongodb://localhost/yelpcamp");
var Camp = require('./models/camp');
var Comment = require('./models/comment');
var User = require('./models/user');

// Auth / Passport config
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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

seedDB();

// Campground Routes
app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/campgrounds', function(req, res) {
    // Get all campsites
    Camp.find()
        .then(function(camps){
            res.render('campgrounds/index', {campgrounds: camps});
        })
        .catch(function(err){
            console.log('Find error: ' + err);
        });
});

app.get('/campgrounds/new', isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

app.get('/campgrounds/:id', function(req, res){
    var camp = Camp.findById(req.params.id).populate('comments').exec()
        .then(function(camp){
            res.render("campgrounds/show", {campground: camp});
        })
        .catch(function(err){
            console.log('Find error: ' + err);
        });
});

app.post('/campgrounds', isLoggedIn, function(req, res){
    var newName = req.body.siteName;
    var newImageURL = req.body.siteImage;
    var newDescription = req.body.description;

    if(newName && newImageURL && newDescription) {
        Camp.create({
            name: newName, image: newImageURL, description: newDescription
        })
        .then(function(camp){
            console.log('new camp: ' + camp);
            res.redirect('/campgrounds');
        })
        .catch(function(err){
            console.log('Camp save error: ' + err);
        });
    }
});

// Comments Routes
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
    var camp = Camp.findById(req.params.id)
        .then(function(camp){
            res.render('comments/new', {camp: camp});
        })
        .catch(function(err){
            console.log(err);
        });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
    Comment.create(req.body.comment)
        .then(function(comment){
            Camp.findById(req.params.id)    
                .then(function(campground) {
                    campground.comments.push(comment._id);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                })   
                .catch(function(err){
                    console.log(err);
                    res.redirect('/');
                });
        })
        .catch(function(err){
            console.log(err);
        });
});


// Auth Routes
app.get('/register', function(req,res) {
    res.render('register');
});

app.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});

app.get('/login', function(req,res) {
    res.render('login');
});

app.post('/login', 
        passport.authenticate('local', {successRedirect: '/campgrounds', failureRedirect: '/register'})
);

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Let's go!
app.listen(PORT, function() {
    console.log("Now camping on " + PORT + "...");
});

