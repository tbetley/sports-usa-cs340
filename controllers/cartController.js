const queries = require("../database/queries.js");
//const mysql = require("../database/dbcon-dev.js");
const mysql = require("../database/dbcon.js");
const uuidv4 = require('uuid');

// Add to cart route
exports.addToCart = function(req, res) {

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
};

exports.removeFromCart = function(req, res) {

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
};

exports.cart = function(req, res) {
    let context = {};
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;
    context.title = "Sports USA - Cart";
    context.cart = req.session.cart;

    if (req.query.err) {
        context.err = true;
    }
    else {
        context.err = false;
    }
    
    res.render("cart.ejs", context);
    
};

exports.placeOrder = function(req, res) {
    
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
            customerID: req.session.passport.user,
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
        
}