var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var PORT = 3000;

// app config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// app data
mongoose.connect("mongodb://localhost/yelpcamp");
var campSchema = mongoose.Schema({
    name: String,
    image: String
});

var Camp = mongoose.model("Camp", campSchema);

app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/campgrounds', function(req, res) {
    // Get all campsites
    Camp.find()
        .then(function(camps){
            res.render('campgrounds', {campgrounds: camps});
        })
        .catch(function(err){
            console.log('Find error: ' + err);
        });
});

app.get('/campgrounds/new', function(req, res){
    res.render("new.ejs");
});

app.post('/campgrounds', function(req, res){
    var newName = req.body.siteName;
    var newImageURL = req.body.siteImage;

    if(newName && newImageURL) {
        Camp.create({
            name: newName, image: newImageURL
        })
        .then(function(camp){
            console.log('new camp: ' + camp);
            res.redirect('campgrounds');
        })
        .catch(function(err){
            console.log('Camp save error: ' + err);
        });
    }
});

app.listen(PORT, function() {
    console.log("Now yelping on " + PORT + "...");
});

