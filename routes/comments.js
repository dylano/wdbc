var express = require('express');
var router = express.Router();
var mw = require('../middleware');

var Camp = require('../models/camp');
var Comment = require('../models/comment');


// Comments Routes
router.get('/campgrounds/:id/comments/new', mw.isLoggedIn, function (req, res) {
    Camp.findById(req.params.id)
        .then(function (camp) {
            res.render('comments/new', { camp: camp });
        })
        .catch(function (err) {
            console.log(err);
        });
});

router.post('/campgrounds/:id/comments', mw.isLoggedIn, function (req, res) {
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

router.get('/campgrounds/:id/comments/:comid/edit', mw.isLoggedIn, mw.verifyCommentOwnership, function (req, res) {
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

router.put('/campgrounds/:id/comments/:comid', mw.isLoggedIn, mw.verifyCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comid, req.body.comment)
        .then(function (comment) {
            res.redirect('/campgrounds/' + req.params.id);
        })
        .catch(function (err) {
            console.log(err);
            res.redirect('/campgrounds/' + req.params.id);
        })
});

router.delete('/campgrounds/:id/comments/:comid', mw.isLoggedIn, mw.verifyCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comid)
        .then(function (camp) {
            res.redirect('/campgrounds/' + req.params.id);
        })
        .catch(function (err) {
            console.log('Remove error: ' + err);
            res.redirect('/campgrounds/' + req.params.id);
        })
});


module.exports = router;