var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");


router.get("/", function(req,res){
    // Get all campgrounds
    Campground.find({}, function (err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {camp: allCampgrounds  })

        }
    })
        
})
router.post("/",middleware.isLoggedIn, function(req,res){
    
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
     var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name:name, image:image,description: desc, author:author}
    
    Campground.create(newCamp, function (err,newlyCreated) {
        // body...
        if(err){
            console.log(err)
        } else {
            
            
            
                res.redirect("/campgrounds");

        }
    })
    // campgrounds.push(newCamp);
})

router.get("/new",middleware.isLoggedIn ,function(req,res){
        
    res.render("campgrounds/new.ejs")
})

// Show route
// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//  EDIT CAMPGROUND
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});



// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});




module.exports = router;