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
app.use(bodyParser.urlencoded({extended: false}));


// local port
const PORT = process.env.PORT || 5000;

/***********************************
 * ROUTES
************************************/
app.get("/", function (req, res) {
    let callbackCount = 0;
    let context = {};
    context.title = "Sports USA";

    queries.getItems(context, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1) {
            res.render("home.ejs", context)
        }
    } 
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

app.get("/cart", function(req, res) {
    let context = {};
    context.title = "Sports USA - Cart";
    res.render("cart.ejs", context);
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


/****************
** Customer Sign Up Routes
*****************/
app.get("/signUp", function(req, res) {
    res.render("signUp.ejs", {title: "Sports USA - Sign Up"});
});

app.post("/signUp", function(req, res) {
    console.log(req.body);
    let callbackCount = 0;

    queries.addCustomer(req.body, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            res.redirect("/admin");
        }
    }
});


/****************************************
** Admin Routes
****************************************/
app.get("/admin", function(req, res) {
    let callbackCount = 0;
    var context = {};
    context.title = "Admin";
    
    queries.getCustomers(context, mysql, complete);
    queries.getItems(context, mysql, complete);
    queries.getVendors(context, mysql, complete);
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

    console.log("Query Type: " + req.query.type);

    if(req.query.type == "item")
    {
        queries.deleteItem(req.query.id, mysql, complete);
        function complete() {
            callbackCount++;
            if (callbackCount === 1)
            {
                res.send("OK");
            }
        }
    }
    else if (req.query.type == "customer")
    {
        queries.deleteCustomer(req.query.id, mysql, complete)
        function complete() {
            callbackCount++;
            if (callbackCount === 1)
            {
                res.send("OK");
            }
        }
    }
    else if (req.query.type == "vendor")
    {
        let context = {};
        // check if items exist under than vendor
        queries.getItemsByVendor(context, req.query.id, mysql, complete);
        function complete() {
            callbackCount++;
            if (callbackCount === 1) {
                
                // if items do not exist under that vendor, delete vendor
                if (context.vendors.length == 0)
                {
                    console.log("No items under that vendor!");
                    queries.deleteVendor(req.query.id, mysql, complete2)
                    function complete2() {
                        callbackCount++;
                        if (callbackCount === 2) {
                            res.send("OK");
                        }
                    }
                }
                else
                {
                    console.log("Attempt to delete vendor with existing items... No Changes Made");
                    res.send("INVALID DELETE");
                }
                
            }
        }
    }
    
});

/****************
** ADMIN - ADD Items/Vendors
*****************/
app.get("/addItem", function(req, res) {
    let context = {};
    let callbackCount = 0;
    context.title = "Add Item";

    queries.getVendors(context, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            res.render("addItem.ejs", context);
        }
    }
});

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

app.get("/addVendor", function(req, res) {
    let context = {};
    context.title = "Add Vendor";

    res.render("addVendor.ejs", context);
});

app.post("/addVendor", function(req, res) {
    console.log(req.body);

    let callbackCount = 0;
    queries.addVendor(req.body, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount == 1)
        {
            res.redirect("/admin");
        }
    }
})

/****************
** ADMIN - UPDATE Items/Vendors/Customers
*****************/
app.get("/updateItem", function(req, res) {
    let callbackCount = 0;
    let context = {};
    context.title = "Update Item";

    console.log("Update Item Requested ID: " + req.query.id);
    queries.getItemsByID(context, req.query.id, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            res.render("updateItem.ejs", context);
        }
    }
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

app.get("/updateCustomer", function(req, res) {
    let callbackCount = 0;
    let context = {};
    context.title = "Update Customer";
    console.log("Update Customer Requested ID: " + req.query.id);

    queries.getCustomersByID(context, req.query.id, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            res.render("updateCustomer.ejs", context);
        }
    }
});

app.post("/updateCustomer", function(req, res) {
    console.log(req.body);
    let callbackCount = 0;

    queries.updateCustomer(req.body, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            res.redirect("/admin");
        }
    }
});

app.get("/updateVendor", function(req, res) {
    let callbackCount = 0;
    let context = {};
    context.title = "Update Vendor";
    console.log("Update Vendor Requested ID: " + req.query.id);

    queries.getVendorsByID(context, req.query.id, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1) {
            res.render("updateVendor.ejs", context);
        }
    }
});

app.post("/updateVendor", function(req, res) {
    console.log(req.body);
    let callbackCount = 0;

    queries.updateVendor(req.body, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            res.redirect("/admin");
        }
    }
})

/********************
** ERROR middleware
*********************/
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