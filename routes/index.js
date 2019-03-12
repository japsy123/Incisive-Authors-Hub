var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var passport = require("passport");
var User = require("../models/user");



router.get("/", function (req,res) {
    
    // body...
    res.render("landing");
});

//  ===========
// AUTH ROUTES
//  ===========

// show register form
router.get("/register", function(req, res) {
    res.render("register")
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds"); 
        });
    });
});


// Show login form
router.get("/login", function(req, res) {
        res.render("login")
})

// Handle login logic
router.post("/login",passport.authenticate("local",{
    
     successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req,res) {
    // body...
})

// logic route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success","Logged out");
   res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Log in please");
    res.redirect("/login");
}


module.exports = router;