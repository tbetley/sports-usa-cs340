/************************************
 * app.js - entry point for Sports USA application. 
 * Authors: Tyler Betley, Guleid Magan
 * Date: Feb 2020
 * Course: CS340
************************************/

/***********************************
 * REQUIRES
************************************/
// local port
const PORT = process.env.PORT || 5000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const mysql = require("./dbcon-dev.js"); // CHANGE TO ./dbcon.js IN PRODUCTION
const mysql = require("./dbcon.js");
const queries = require("./queries.js");
const session = require("express-session");
const uuidv4 = require('uuid');


/*************************
** MIDDLEWARE
*************************/
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('trust proxy', 1); // remove in dev
app.use(session({
    secret: "superSecretPassword",
    saveUninitialized: true,
    resave: true,
    cookie: { 
        secure: true // set to false in dev
    }
}));

// Set session data, accessed each time a request is sent to the app
app.use(function(req, res, next) {
    // initialize session data
    if (req.session.views) {
        req.session.views++;
    }
    else {
        req.session.views = 1;
        req.session.cart = [];
        req.session.loggedIn = false;
        req.session.username = null;
        req.session.customerID = null;
    }
    console.log(req.session);
    next();
});


/***********************************
 * ROUTES
************************************/
app.get("/", function (req, res) {

    let callbackCount = 0;
    let context = {};
    context.title = "Sports USA";
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;

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
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;

    // query all items, send as object to template
    queries.getItems(context, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1) {
            res.render("items.ejs", context)
        }
    }
});

// Add to cart route
app.get("/addToCart", function(req, res) {

    // check if item already exists in cart, if so increment the quantityDesired
    let itemFound = false;
    let itemID = req.query.itemID;
    req.session.cart.forEach(function(item) {
        if (item.itemID == itemID)
        {
            item.quantityDesired++;
            itemFound = true;
            res.redirect("/cart");
        }
    });

    if (!itemFound)
    {
        // query database for item info, push into users cart
        let callbackCount = 0;
        let context = {};
        context.items = [];
        queries.getItemsByID(context, req.query.itemID, mysql, complete);
        function complete() {
            callbackCount++;
            if (callbackCount === 1)
            {
                // append data
                context.items[0].quantityDesired = 1;

                // add to cart
                req.session.cart.push(context.items[0]);

                res.redirect("/cart");
            }
        }  
    }
    
})

app.get("/removeFromCart", function(req, res) {

    // delete item from cart
    let itemID = req.query.itemID;
    
    let newCart = req.session.cart.filter(function(item) {
        console.log(item);
        return item.itemID != itemID;
    });
    console.log("New Cart: ");
    console.log(newCart);

    req.session.cart = newCart;

    res.redirect("/cart");
})

app.get("/cart", function(req, res) {
    let context = {};
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    context.title = "Sports USA - Cart";
    context.cart = req.session.cart;

    if (req.query.err) {
        context.err = true;
    }
    else {
        context.err = false;
    }
    
    res.render("cart.ejs", context);
    
});

app.get("/placeOrder", function(req, res) {
    
    // ensure customer is logged in and cart contains items
    if (req.session.loggedIn && req.session.cart.length > 0)
    {
        // create order associated with that customer
        let context = {};
        context.orderID = null;
        let callbackCount = 0;
        let date = new Date();
        date = date.toISOString().slice(0, 10);

        let order = {
            customerID: req.session.customerID,
            orderDate: date,
            shipStatus: "Pending",
            trackingNumber: uuidv4.v4()
        }

        queries.createOrder(context, order, mysql, complete);
        function complete() {
            callbackCount++;
            if (callbackCount === 1)
            {
                // create orderItems for each itemID in the customer cart, associated with order ID
                callbackCount = 0;
                req.session.cart.forEach(function(item) {
                    queries.createOrderItem(context.orderID, item.itemID, item.quantityDesired, mysql, complete2);
                });
                function complete2() {
                    callbackCount++;
                    if (callbackCount == req.session.cart.length)
                    {
                        // clear customer cart
                        req.session.cart = [];

                        res.redirect("/");
                    }
                }
            
            }
        }  
    }
    else
    {
        res.redirect("/cart?err=true");
    }
        
})

app.get("/viewOrders", function(req, res) {
    
    let callbackCount = 0;
    let context = {};
    context.title = "Orders";
    context.customerID = req.query.customerID;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    context.orders = [];
    // select all orders from that customer
    queries.getOrdersByCustomer(context, req.query.customerID, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1)
        {
            console.log(context);
            res.render("viewOrders.ejs", context);
        }
    }

});

app.get("/categories/:item", function(req, res) {
    let sport = req.params.item;
    let context = {};
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
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
** Customer Login/logout Routes
*****************/
app.get("/login", function(req, res) {

    let context = {};
    context.title = "Login";

    if (req.query.err) {
        context.err = true;
    }
    else {
        context.err = false
    }

    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;

    res.render("login.ejs", context);
});

app.post("/login", function(req, res) {

    let callbackCount = 0;

    // query database for username
    queries.getCustomerIDByLogin(req.session, req.body.logIn, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1) {
            // check to see if customerID was found
            //console.log(req.session);
            if (req.session.customerID != null)
            {
                req.session.loggedIn = true;
                req.session.username = req.body.logIn;
                res.redirect("/");
            }
            else
            {
                res.redirect("/login?err=invalidLogIn");
            }
        }
    }
});

app.get("/logout", function(req, res) {
    if (req.session.loggedIn) {
        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
            }
            res.redirect("/");
        });
    }
});


/****************
** Customer Sign Up Routes
*****************/
app.get("/signUp", function(req, res) {
    let context = {};
    context.title = "Sign Up";
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    res.render("signUp.ejs", context);
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
    let context = {};
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
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
        let context = {};
        context.err = false;
        queries.deleteItem(context, req.query.id, mysql, complete);
        function complete() {
            callbackCount++;
            if (callbackCount === 1)
            {
                if (context.err)
                {
                    res.send("INVALID DELETE");
                }
                else
                {
                    res.send("OK");
                }
                
            }
        }
    }
    else if (req.query.type == "customer")
    {
        let context = {};
        context.err = false;
        queries.deleteCustomer(context, req.query.id, mysql, complete)
        function complete() {
            callbackCount++;
            if (callbackCount === 1)
            {
                if (context.err)
                {
                    res.send("INVALID DELETE");
                }
                else
                {
                    res.send("OK");
                }
                
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
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
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
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
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
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    context.items = [];
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
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
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
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
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