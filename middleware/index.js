var Camp = require('../models/camp');
var Comment = require('../models/comment');

var middleware = {};

middleware.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

middleware.verifyCampOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Camp.findById(req.params.id)
            .then(function(camp){
                if(camp.author.id.equals(req.user._id)) {
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

middleware.verifyCommentOwnership = function (req, res, next) {
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


module.exports = middleware;