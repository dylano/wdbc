const express = require("express");
const mw = require("../middleware");
const Camp = require("../models/camp");
const Comment = require("../models/comment");

const router = express.Router();

// Comments Routes
router.get("/campgrounds/:id/comments/new", mw.isLoggedIn, (req, res) => {
  Camp.findById(req.params.id)
    .then(camp => {
      res.render("comments/new", { camp });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/campgrounds/:id/comments", mw.isLoggedIn, (req, res) => {
  Comment.create(req.body.comment)
    .then(comment => {
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      comment.save();
      Camp.findById(req.params.id)
        .then(campground => {
          campground.comments.push(comment._id);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        })
        .catch(err => {
          console.log(err);
          res.redirect("/");
        });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get(
  "/campgrounds/:id/comments/:comid/edit",
  mw.isLoggedIn,
  mw.verifyCommentOwnership,
  (req, res) => {
    Camp.findById(req.params.id)
      .then(camp => {
        Comment.findById(req.params.comid).then(comment => {
          res.render("comments/edit", { camp, comment });
        });
      })
      .catch(err => {
        console.log(err);
        res.redirect("/");
      });
  }
);

router.put(
  "/campgrounds/:id/comments/:comid",
  mw.isLoggedIn,
  mw.verifyCommentOwnership,
  (req, res) => {
    Comment.findByIdAndUpdate(req.params.comid, req.body.comment)
      .then(() => {
        res.redirect(`/campgrounds/${req.params.id}`);
      })
      .catch(err => {
        console.log(err);
        res.redirect(`/campgrounds/${req.params.id}`);
      });
  }
);

router.delete(
  "/campgrounds/:id/comments/:comid",
  mw.isLoggedIn,
  mw.verifyCommentOwnership,
  (req, res) => {
    Comment.findByIdAndRemove(req.params.comid)
      .then(() => {
        res.redirect(`/campgrounds/${req.params.id}`);
      })
      .catch(err => {
        console.log(`Remove error: ${err}`);
        res.redirect(`/campgrounds/${req.params.id}`);
      });
  }
);

module.exports = router;
