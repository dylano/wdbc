var express = require('express');
var router = express.Router();

var Camp = require('../models/camp');
var Comment = require('../models/comment');


// Comments Routes
router.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
    Camp.findById(req.params.id)
        .then(function (camp) {
            res.render('comments/new', { camp: camp });
        })
        .catch(function (err) {
            console.log(err);
        });
});

router.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
    Comment.create(req.body.comment)
        .then(function (comment) {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            Camp.findById(req.params.id)
                .then(function (campground) {
                    campground.comments.push(comment._id);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                })
                .catch(function (err) {
                    console.log(err);
                    res.redirect('/');
                });
        })
        .catch(function (err) {
            console.log(err);
        })
});

router.get('/campgrounds/:id/comments/:comid/edit', isLoggedIn, verifyOwnership, function (req, res) {
    Camp.findById(req.params.id)
        .then(function (camp) {
            Comment.findById(req.params.comid)
                .then(function (comment) {
                    res.render('comments/edit', { camp: camp, comment: comment });
                });
        })
        .catch(function (err) {
            console.log(err);
            res.redirect('/');
        });
});

router.put('/campgrounds/:id/comments/:comid', isLoggedIn, verifyOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comid, req.body.comment)
        .then(function(comment){
            res.redirect('/campgrounds/' + req.params.id);
        })
        .catch(function(err){
            console.log(err);
            res.redirect('/campgrounds/' + req.params.id);
        })
});

router.delete('/campgrounds/:id/comments/:comid', isLoggedIn, verifyOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comid)
        .then(function(camp){
            res.redirect('/campgrounds/' + req.params.id);
        })
        .catch(function(err){
            console.log('Remove error: ' + err);
            res.redirect('/campgrounds/' + req.params.id);
        })
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function verifyOwnership (req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comid)
            .then(function(comment){
                if(comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log('user mismatch');
                    res.redirect('back');
                }
            })
            .catch(function(err){
                res.redirect('back');
            });
    } else {
        console.log('not authed');
        res.redirect('back');
    }
}


module.exports = router;