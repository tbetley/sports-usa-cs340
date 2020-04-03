const queries = require("../database/queries.js");
//const mysql = require("../database/dbcon-dev.js");
const mysql = require("../database/dbcon.js");

exports.admin = function(req, res) {
    let callbackCount = 0;
    let context = {};
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;
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
};

exports.adminDelete = function(req, res) {
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
    
};

exports.viewOrders = function(req, res) {
    
    let callbackCount = 0;
    let context = {};
    context.title = "Orders";
    context.customerID = req.query.customerID;
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;
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

};

exports.addItemGet = function(req, res) {
    let context = {};
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;
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
};

exports.addItemPost = function(req, res) {
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
};

exports.addVendorGet = function(req, res) {
    let context = {};
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;
    context.title = "Add Vendor";

    res.render("addVendor.ejs", context);
};

exports.addVendorPost = function(req, res) {
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
};

exports.updateItemGet = function(req, res) {
    let callbackCount = 0;
    let context = {};
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;
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
};

exports.updateItemPost = function(req, res) {
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
};

exports.updateCustomerGet = function(req, res) {
    let callbackCount = 0;
    let context = {};
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;
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
};

exports.updateCustomerPost = function(req, res) {
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
};

exports.updateVendorGet = function(req, res) {
    let callbackCount = 0;
    let context = {};
    if (req.session.loggedIn) context.username = req.session.username;
    req.session.loggedIn ? context.loggedIn = true : context.loggedIn = false;
    req.session.isAdmin ? context.isAdmin = true : context.isAdmin = false;
    context.title = "Update Vendor";
    console.log("Update Vendor Requested ID: " + req.query.id);

    queries.getVendorsByID(context, req.query.id, mysql, complete);
    function complete() {
        callbackCount++;
        if (callbackCount === 1) {
            res.render("updateVendor.ejs", context);
        }
    }
};

exports.updateVendorPost = function(req, res) {
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
};