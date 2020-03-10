/************************************
 * app.js - entry point for Sports USA application. 
 * Authors: Tyler Betley, Guleid Magan
 * Date: Feb 2020
 * Course: CS340
************************************/

/***********************************
 * REQUIRES
************************************/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const mysql = require("./dbcon-dev.js"); // CHANGE TO ./dbcon.js IN PRODUCTION
const mysql = require("./dbcon.js");
const queries = require("./queries.js");


/*************************
** MIDDLEWARE
*************************/
app.use(express.static("public"));
app.use(bodyParser.json());


// local port
const PORT = process.PORT || 5000;

/***********************************
 * ROUTES
************************************/
app.get("/", function (req, res) {
    res.render("home.ejs", {title: "Sports USA"});  
});

app.get("/cart", function(req, res) {
    res.render("cart.ejs", {title: "Sports USA - Cart"});
});

app.get("/categories/:item", function(req, res) {
    let sport = req.params.item;
    let context = {};
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
    
});

app.get("/signUp", function(req, res) {
    res.render("signUp.ejs", {title: "Sports USA - Sign Up"});
});

app.get("/items", function (req, res) {
    let callbackCount = 0;
    let context = {};
    context.title = "Sports USA - Items";

    // query all items, send as object to template
    queries.getItems(context, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1) {
            res.render("items.ejs", context)
        }
    }
});

app.get("/admin", function(req, res) {
    let callbackCount = 0;
    var context = {};
    context.title = "Admin";
    
    queries.getCustomers(context, mysql, complete);
    queries.getItems(context, mysql, complete);
    queries.getVendors(context, mysql, complete)
    function complete() {
        callbackCount++;
        if (callbackCount === 3)
        {
            res.render("admin.ejs", context);
        }
    }
});

app.delete("/admin", function(req, res) {
    let callbackCount = 0;
    req.query.id;
    queries.deleteItem(req.query.id, mysql, complete);
    function complete() {
        callbackCount++
        if (callbackCount === 1)
        {
            res.send("OK");
        }
    }
})

app.post("/addItem", function(req, res) {
    console.log(req.body);
    let callbackCount = 0;

    queries.addItem(req.body, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            res.redirect("/admin");
        }
    }
});

app.get("/addItem", function(req, res) {
    let context = {};
    context.title = "Add Item";
    res.render("addItem.ejs", context);
});

app.post("/updateItem", function(req, res) {
    console.log(req.body);
    let callbackCount = 0;

    queries.updateItem(req.body, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            res.redirect("/admin");
        }
    }
});

app.get("/updateItem", function(req, res) {
    let context = {};
    context.title = "Update Item";
    res.render("updateItem.ejs", context);
});



// ERROR middleware
app.use(function(req, res) {
    res.type("text/plain");
    res.status(404);
    res.send("404 - Not Found");
});

app.use(function(err, req, res, next) {
    console.log(err);
    res.type("plain/text");
    res.status(500);
    res.send("500 - Server Error");
});


app.listen(PORT, function() {
    console.log(`Server Running on PORT: ${PORT}`);
})


/**************************************************
** HELPER FUNCTIONS - MOVE TO NEW FILE EVENTUALLY
TODO: consoidate get functions to take query as argument
**************************************************/

