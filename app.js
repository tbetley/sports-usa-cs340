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
const mysql = require("./dbcon.js");

// Tell express to use public folder to serve assets
app.use(express.static("public"));


// local port
const PORT = process.env.PORT || 5000;

/***********************************
 * ROUTES
************************************/
app.get("/", function (req, res) {
    res.render("home.ejs", {title: "Sports USA"});  // title is the Tab Name, passed to ejs header
})

app.get("/cart", function(req, res) {
    res.render("cart.ejs", {title: "Sports USA - Cart"});
})

app.get("/categories/:item", function(req, res) {
    var item = req.params.item;
    res.render("categories.ejs", {title: item})
})

app.get("/signUp", function(req, res) {
    res.render("signUp.ejs", {title: "Sports USA - Sign Up"});
})

app.get("/vendors", function (req, res) {
    res.render("vendors.ejs", {title: "Sports USA - Vendors"});
})

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
})


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

