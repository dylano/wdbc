var express = require('express');
var router = express.Router();

var Camp = require('../models/camp');
var Comment = require('../models/comment');


// Comments Routes
router.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
    var camp = Camp.findById(req.params.id)
        .then(function(camp){
            res.render('comments/new', {camp: camp});
        })
        .catch(function(err){
            console.log(err);
        });
});

router.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
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

function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;