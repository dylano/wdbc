const express = require("express");
const mw = require("../middleware");
const Camp = require("../models/camp");

const router = express.Router();

router.get("/campgrounds", (req, res) => {
  // Get all campsites
  Camp.find()
    .then(camps => {
      res.render("campgrounds/index", { campgrounds: camps });
    })
    .catch(err => {
      console.log(`Find error: ${err}`);
    });
});

router.get("/campgrounds/new", mw.isLoggedIn, (req, res) => {
  res.render("campgrounds/new.ejs");
});

router.get("/campgrounds/:id", (req, res) => {
  Camp.findById(req.params.id)
    .populate("comments")
    .exec()
    .then(camp => {
      res.render("campgrounds/show", { campground: camp });
    })
    .catch(err => {
      console.log(`Find error: ${err}`);
    });
});

router.post("/campgrounds", mw.isLoggedIn, (req, res) => {
  const newCamp = req.body.camp;
  newCamp.author = {
    id: req.user._id,
    username: req.user.username
  };

  Camp.create(newCamp)
    .then(camp => {
      console.log(`new camp: ${camp}`);
      res.redirect("/campgrounds");
    })
    .catch(err => {
      console.log(`Camp save error: ${err}`);
    });
});

router.get(
  "/campgrounds/:id/edit",
  mw.isLoggedIn,
  mw.verifyCampOwnership,
  (req, res) => {
    Camp.findById(req.params.id)
      .then(camp => {
        res.render("campgrounds/edit", { campground: camp });
      })
      .catch(err => {
        console.log(`Find error: ${err}`);
        res.redirect("/campgrounds");
      });
  }
);

router.put(
  "/campgrounds/:id",
  mw.isLoggedIn,
  mw.verifyCampOwnership,
  (req, res) => {
    Camp.findByIdAndUpdate(req.params.id, req.body.camp)
      .then(() => {
        res.redirect(`/campgrounds/${req.params.id}`);
      })
      .catch(err => {
        console.log(`Update error: ${err}`);
        res.redirect("/campgrounds");
      });
  }
);

router.delete(
  "/campgrounds/:id",
  mw.isLoggedIn,
  mw.verifyCampOwnership,
  (req, res) => {
    Camp.findByIdAndRemove(req.params.id)
      .then(() => {
        res.redirect("/campgrounds");
      })
      .catch(err => {
        console.log(`Remove error: ${err}`);
        res.redirect("/campgrounds");
      });
  }
);

module.exports = router;
