var express = require('express'),
     bodyParser = require('body-parser'),
     mongoose = require('mongoose'),
     seedDB = require('./seed.js'),
     app = express();
     
var PORT = 3000;

// app config
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelpcamp");

// Models
var Camp = require('./models/camp');
var Comment = require('./models/comment');

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

app.get('/campgrounds/new', function(req, res){
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

app.post('/campgrounds', function(req, res){
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
app.get('/campgrounds/:id/comments/new', function(req, res) {
    var camp = Camp.findById(req.params.id)
        .then(function(camp){
            res.render('comments/new', {camp: camp});
        })
        .catch(function(err){
            console.log(err);
        });
});

app.post('/campgrounds/:id/comments', function(req, res){
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

app.listen(PORT, function() {
    console.log("Now camping on " + PORT + "...");
});

