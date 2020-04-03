const queries = require("../database/queries.js");
//const mysql = require("../database/dbcon-dev.js");
const mysql = require("../database/dbcon.js");
const passport = require('passport');
const crypto = require('crypto');

exports.loginGet = function(req, res) {

    let context = {};
    context.title = "Login";

    if (req.query.err) {
        context.err = true;
    }
    else {
        context.err = false
    }

    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;

    res.render("login.ejs", context);
};


exports.loginPost = function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
        if (err || !user) {
            console.log("Error authenticating user");
            res.redirect("/login?err=true");
        }
        else {
            req.logIn(user, function(err) {
                if (err) {
                    res.redirect("Error logging in user");
                    res.redirect("/login?err=true");
                }
                else {
                    console.log(req.user);
                    req.session.loggedIn = true;
                    req.session.username = req.user.logIn;
                    if (req.user.isAdmin == 1) {
                        req.session.isAdmin = true;
                    }
                    res.redirect("/");
                }
            })
        }
    }) (req, res, next);
};


exports.logout = function(req, res) {
    req.logout();
    req.session.destroy(function(err) {
        if (err) console.log(err);
        res.redirect("/login");
    })   
};


/****************
** Customer Sign Up Routes
*****************/
exports.signUpGet = function(req, res) {
    let context = {};
    context.title = "Sign Up";
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;
    res.render("signUp.ejs", context);
};

exports.signUpPost = function(req, res) {
    console.log(req.body);
    let callbackCount = 0;

    // pass salt + password to query, which will be encrypted into the database using SHA1
    // randomly generate salt
    let salt = crypto.randomBytes(32).toString('hex'); 
    req.body.salt = salt;
    req.body.hash = salt + req.body.password;

    queries.addCustomer(req.body, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            res.redirect("/admin");
        }
    }
};