const queries = require("../database/queries.js");
//const mysql = require("../database/dbcon-dev.js");
const mysql = require("../database/dbcon.js");

exports.homePage = function (req, res) {

    let callbackCount = 0;
    let context = {};
    context.title = "Sports USA";
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;

    queries.getItems(context, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1) {
            res.render("home.ejs", context)
        }
    } 
};

exports.itemsPage = function (req, res) {
    let callbackCount = 0;
    let context = {};
    context.title = "Sports USA - Items";
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;

    // query all items, send as object to template
    queries.getItems(context, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1) {
            res.render("items.ejs", context)
        }
    }
};

exports.categoriesItems = function(req, res) {
    let sport = req.params.item;
    let context = {};
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;
    context.title = sport;
    let callbackCount = 0;
    
    // get all items of the specific item
    queries.getItemsBySport(context, sport, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1) {
            res.render("categories.ejs", context);
        }
    }   
};