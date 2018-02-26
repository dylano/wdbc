const Camp = require("../models/camp");
const Comment = require("../models/comment");

const middleware = {};

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

middleware.verifyCampOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Camp.findById(req.params.id)
      .then(camp => {
        if (camp.author.id.equals(req.user._id)) {
          next();
        } else {
          console.log("user mismatch");
          res.redirect("back");
        }
      })
      .catch(() => {
        res.redirect("back");
      });
  } else {
    console.log("not authed");
    res.redirect("back");
  }
};

middleware.verifyCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comid)
      .then(comment => {
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          console.log("user mismatch");
          res.redirect("back");
        }
      })
      .catch(() => {
        res.redirect("back");
      });
  } else {
    console.log("not authed");
    res.redirect("back");
  }
};

module.exports = middleware;
