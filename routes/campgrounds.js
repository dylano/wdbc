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
    var newCamp = req.body.camp;
    newCamp.author = {
        id: req.user._id,
        username: req.user.username
    }

    Camp.create(newCamp)
        .then(function(camp){
            console.log('new camp: ' + camp);
            res.redirect('/campgrounds');
        })
        .catch(function(err){
            console.log('Camp save error: ' + err);
        });
});

router.get('/campgrounds/:id/edit', isLoggedIn, function(req, res){
    var camp = Camp.findById(req.params.id)
        .then(function(camp){
            res.render("campgrounds/edit", {campground: camp});
        })
        .catch(function(err){
            console.log('Find error: ' + err);
            res.redirect('/campgrounds');
        });
});

router.put('/campgrounds/:id', isLoggedIn, function(req, res){
    Camp.findByIdAndUpdate(req.params.id, req.body.camp)
        .then(function(camp){
            res.redirect('/campgrounds/' + req.params.id);
        })
        .catch(function(err){
            console.log('Update error: ' + err);
            res.redirect('/campgrounds');
        });
});

router.delete('/campgrounds/:id', isLoggedIn, function(req, res){
    Camp.findByIdAndRemove(req.params.id)
        .then(function(camp){
            res.redirect('/campgrounds');
        })
        .catch(function(err){
            console.log('Remove error: ' + err);
            res.redirect('/campgrounds');
        })
});

function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;