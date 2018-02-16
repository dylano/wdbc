var express = require('express');
var router = express.Router();

var Camp = require('../models/camp');

router.get('/campgrounds', function(req, res) {
    // Get all campsites
    Camp.find()
        .then(function(camps){
            res.render('campgrounds/index', {campgrounds: camps});
        })
        .catch(function(err){
            console.log('Find error: ' + err);
        });
});

router.get('/campgrounds/new', isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

router.get('/campgrounds/:id', function(req, res){
    var camp = Camp.findById(req.params.id).populate('comments').exec()
        .then(function(camp){
            res.render("campgrounds/show", {campground: camp});
        })
        .catch(function(err){
            console.log('Find error: ' + err);
        });
});

router.post('/campgrounds', isLoggedIn, function(req, res){
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

function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;