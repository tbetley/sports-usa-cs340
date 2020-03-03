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


/*************************
** MIDDLEWARE
*************************/
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// local port
const PORT = process.env.PORT || 5000;

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
    var item = req.params.item;
    res.render("categories.ejs", {title: item})
});

app.get("/signUp", function(req, res) {
    res.render("signUp.ejs", {title: "Sports USA - Sign Up"});
});

app.get("/items", function (req, res) {
    let callbackCount = 0;
    let context = {};
    context.title = "Sports USA - Items";

    // query all items, send as object to template
    getItems(context, mysql, complete);
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
    
    getCustomers(context, mysql, complete);
    getItems(context, mysql, complete);
    getVendors(context, mysql, complete)
    function complete() {
        callbackCount++;
        if (callbackCount === 3)
        {
            res.render("admin.ejs", context);
        }
    }
});

app.post("/addItem", function(req, res) {
    console.log(req.body);
    let context = {};
    context.title = "Add Item";
    let callbackCount = 0;

    addItem(req.body, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            res.render("addItem.ejs", context);
        }
    }
});

app.get("/addItem", function(req, res) {
    let context = {};
    context.title = "Add Item";
    res.render("addItem.ejs", context);
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
function getCustomers(context, mysql, complete)
{
    let query = "SELECT customerID, firstName, lastName, email, phoneNumber, logIn, streetAddress, city, zip, state FROM customers";
    mysql.pool.query(query, function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        context.customers = results;
        complete();
    });
} 

function getItems(context, mysql, complete)
{
    let query = "SELECT itemID, vendorName, itemName, price, quantity, type, sport FROM items JOIN vendors ON items.vendorID = vendors.vendorID";
    mysql.pool.query(query, function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        context.items = results;
        complete();
    });
} 

function getVendors(context, mysql, complete)
{
    let query = "SELECT vendorName FROM vendors";
    mysql.pool.query(query, function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        context.vendors = results;
        complete();
    });
} 


function addItem(context, mysql, complete)
{
    let query = `INSERT INTO items (vendorID, itemName, price, quantity, type, sport) VALUES ((SELECT vendorID FROM vendors WHERE vendorName="${context.vendor}"), "${context.itemName}", "${context.price}", ${context.quantity}, "${context.type}", "${context.sport}")`;

    mysql.pool.query(query, function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        complete();
    });
}
