/************************************
 * app.js - entry point for Sports USA application. 
 * Authors: Tyler Betley
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
const session = require("express-session");
const helpers = require("./config/helper");  // contains helper functions


let main_controller = require("./controllers/mainController");
let cart_controller = require("./controllers/cartController");
let admin_controller = require("./controllers/adminController");
let auth_controller = require("./controllers/authController");


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
        secure: false // set to false in dev
    }
}));

// Execute passport configuration using local configuration
require("./config/passport.js") (app);


// Set session data, accessed each time a request is sent to the app
app.use(function(req, res, next) {
    console.log("In set session data function");
    if (req.session.views) {
        req.session.views++;
    }
    else {
        req.session.views = 1;
        req.session.cart = [];
        req.session.loggedIn = false;
        req.session.username = null;
        req.session.isAdmin = false;
    }
    console.log(req.session);
    next();
});


/***********************************
 * ROUTES
************************************/

app.get("/", main_controller.homePage);

app.get("/items", main_controller.itemsPage);

app.get("/categories/:item", main_controller.categoriesItems);

/***********************************
 * CART/ORDERS Routes
************************************/
app.get("/addToCart", cart_controller.addToCart);

app.get("/removeFromCart", cart_controller.removeFromCart);

app.get("/cart", cart_controller.cart);

app.get("/placeOrder", cart_controller.placeOrder);


/****************
** Customer Login/logout Routes
*****************/
app.get("/login", auth_controller.loginGet);

app.post("/login", auth_controller.loginPost);

app.get("/logout", auth_controller.logout);

app.get("/signUp", auth_controller.signUpGet);

app.post("/signUp", auth_controller.signUpPost);


/****************************************
** ADMIN MAIN
****************************************/
app.get("/admin", helpers.isAdminLoggedIn, admin_controller.admin);

app.delete("/admin", helpers.isAdminLoggedIn, admin_controller.adminDelete);

app.get("/viewOrders", helpers.isAdminLoggedIn, admin_controller.viewOrders);


/****************
** ADMIN - ADD Items/Vendors
*****************/
app.get("/addItem", helpers.isAdminLoggedIn, admin_controller.addItemGet);

app.post("/addItem", helpers.isAdminLoggedIn, admin_controller.addItemPost);

app.get("/addVendor", helpers.isAdminLoggedIn, admin_controller.addVendorGet);

app.post("/addVendor", helpers.isAdminLoggedIn, admin_controller.addVendorPost);


/****************
** ADMIN - UPDATE Items/Vendors/Customers
*****************/
app.get("/updateItem", helpers.isAdminLoggedIn, admin_controller.updateItemGet);

app.post("/updateItem", helpers.isAdminLoggedIn, admin_controller.updateItemPost);

app.get("/updateCustomer", helpers.isAdminLoggedIn, admin_controller.updateCustomerGet);

app.post("/updateCustomer", helpers.isAdminLoggedIn, admin_controller.updateCustomerPost);

app.get("/updateVendor", helpers.isAdminLoggedIn, admin_controller.updateVendorGet);

app.post("/updateVendor", helpers.isAdminLoggedIn, admin_controller.updateVendorPost);


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