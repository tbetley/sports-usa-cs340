function getCustomers(context, mysql, complete)
{
    let query = "SELECT customerID, firstName, lastName, email, phoneNumber, logIn, streetAddress, city, zip, state, isAdmin FROM customers";
    mysql.pool.query(query, function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("getCustomers succeeded...");
        //console.log(results);
        context.customers = results;
        complete();
    });
} 

function getCustomersByID(context, customerID, mysql, complete)
{
    let query = "SELECT * FROM customers WHERE customerID = ? "; 
    mysql.pool.query(query, [customerID], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("getCustomersByID succeeded...");
        //console.log(results);
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
        console.log("getItems succeeded...");
        //console.log(results);
        context.items = results;
        complete();
    });
} 

function getItemsByVendor(context, vendorID, mysql, complete)
{
    let query = "SELECT itemName FROM items JOIN vendors ON items.vendorID = vendors.vendorID WHERE vendors.vendorID=? ";
    mysql.pool.query(query, [vendorID], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("getItemsByVendor succeeded...");
        //console.log(results);
        context.vendors = results;
        complete();
    })
}

function getItemsBySport(context, sport, mysql, complete)
{
    let query = "SELECT itemID, vendorName, itemName, price, quantity, type, sport FROM items JOIN vendors ON items.vendorID = vendors.vendorID WHERE items.sport = ? ";
    mysql.pool.query(query, [sport], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("getItemsBySport succeeded...");
        //console.log(results);
        context.items = results;
        complete();
    });
}

function getItemsByID(context, itemID, mysql, complete)
{
    let query = "SELECT itemID, itemName, price, quantity, type, sport FROM items WHERE itemID=?";
    mysql.pool.query(query, [itemID], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("getItemsByID succeeded...");
        //console.log(results[0]);
        context.items.push(results[0]);
        complete();
    });
}


function getVendors(context, mysql, complete)
{
    let query = "SELECT vendorID, vendorName, website, phoneNumber FROM vendors";
    mysql.pool.query(query, function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("getVendors succeeded...");
        //console.log(results);
        context.vendors = results;
        complete();
    });
} 

function getVendorsByID(context, vendorID, mysql, complete)
{
    let query = "SELECT * FROM vendors WHERE vendorID=? ";
    mysql.pool.query(query, [vendorID], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("getVendorsByID succeeded...");
        //console.log(results);
        context.vendors = results;
        complete();
    })
}


function addItem(req, mysql, complete)
{
    console.log("Adding the following Item: " + req.itemName);
    //console.log(req);
    let query = 'INSERT INTO items (vendorID, itemName, price, quantity, type, sport) VALUES ((SELECT vendorID FROM vendors WHERE vendorName=?), ?, ?, ?, ?, ?)';

    mysql.pool.query(query, [req.vendor, req.itemName, req.price, req.quantity, req.type, req.sport], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("Add item succeeded...");
        complete();
    });
}

function deleteItem(context, itemID, mysql, complete)
{
    console.log("Deleting the Item with ID: " + itemID);
    mysql.pool.query("DELETE FROM items WHERE itemID=? ", [itemID], function(err, result) {
        if (err)
        {
            console.log(err);
            context.err = true;
            console.log("Delete item failed...");
            complete();
        }
        else
        {
            console.log("Delete item succeeded...");
            complete();
        }
        
    });
}

function updateItem(req, mysql, complete)
{
    console.log("Updating the following Item: " + req.itemName);
    //console.log(req);

    let query = "UPDATE items SET itemName=?, price=?, quantity=?, type=?, sport=? WHERE itemID=? ";
    mysql.pool.query(query, [req.itemName, req.price, req.quantity, req.type, req.sport, req.itemID], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("Update item succeeded...");
        complete();
    });
}

function updateCustomer(req, mysql, complete)
{
    console.log("Updating the following Customer: " + req.logIn);
    //console.log(req);

    let query = "UPDATE customers SET email=?, phoneNumber=?, logIn=?, firstName=?, lastName=?, streetAddress=?, city=?, zip=?, state=? WHERE customerID=? ";
    mysql.pool.query(query, [req.email, req.phoneNumber, req.logIn, req.firstName, req.lastName, req.streetAddress, req.city, req.zip, req.state, req.customerID], function(err, results, fields) {
        if(err) {
            console.log(err);
            complete();
        }
        console.log("Update customer succeeded...");
        complete();
    });
}

function updateVendor(req, mysql, complete)
{
    console.log("Updating the following Vendor: " + req.vendorName);
    //console.log(req);

    let query = "UPDATE vendors SET vendorName=?, website=?, phoneNumber=? WHERE vendorID=? ";
    mysql.pool.query(query, [req.vendorName, req.website, req.phoneNumber, req.vendorID], function(err, results, fields) {
        if(err) {
            console.log(err);
            complete();
        }
        console.log("Update vendor succeeded...");
        complete();
    })
}

function addCustomer(req, mysql, complete)
{
    console.log("Adding the following Customer: " + req.logIn);
    //console.log(req);
    let query = "INSERT INTO customers (email, phoneNumber, logIn, salt, hash, firstName, lastName, streetAddress, city, zip, state, isAdmin) values (?, ?, ?, ?, SHA2(?, 256), ?, ?, ?, ?, ?, ?, ?) ";

    mysql.pool.query(query, [req.email, req.phoneNumber, req.logIn, req.salt, req.hash, req.firstName, req.lastName, req.streetAddress, req.city, req.zip, req.state, 0], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("Add customer suceeded...");
        complete();
    });
}

function deleteCustomer(context, customerID, mysql, complete)
{
    console.log("Deleting the Customer with ID: " + customerID);
    mysql.pool.query("DELETE FROM customers WHERE customerID=? ", [customerID], function(err, result) {
        if (err)
        {
            context.err = true;
            console.log(err);
            console.log("Delete Customer Failed");
            complete();
        }
        else
        {
            console.log("Delete customer succeeded...");
            complete();
        }
        
    });
}

function deleteVendor(vendorID, mysql, complete)
{
    console.log("Deleting vendor with ID: " + vendorID);
    let query = "DELETE FROM vendors WHERE vendorID=? ";
    mysql.pool.query(query, [vendorID], function(err, results) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("Delete vendor succeeded...");
        complete();
    })
}

function addVendor(req, mysql, complete)
{
    console.log("Adding the following Vendor: " + req.vendorName);
    //console.log(req);
    let query = "INSERT INTO vendors (vendorName, website, phoneNumber) values (?, ?, ?) ";

    mysql.pool.query(query, [req.vendorName, req.website, req.phoneNumber], function(err, results, fields) {
        if (err)
        {
            console.log(err);
        }
        console.log("Add vendor succeeded...");
        complete();
    });
}

function getCustomerIDByLogin(session, logIn, mysql, complete)
{
    let query = "SELECT customerID FROM customers WHERE logIn=? ";

    mysql.pool.query(query, [logIn], function(err, results, fields) {
        if (err)
        {
            console.log(err);
        }
        console.log("Results: ");
        console.log(results[0]);

        if (results[0]) {
            session.customerID = results[0].customerID;
        }

        console.log(session);
        console.log("Get customerID succeeded...");
        complete();
    })
}

function getCustomersByLogin(context, logIn, mysql, complete)
{
    let query = "SELECT * FROM customers WHERE logIn=? ";

    mysql.pool.query(query, [logIn], function(err, results, fields) {
        if (err)
        {
            console.log(err);
            context.err;
            complete();
        }
        else
        {
            context.results = results;
            //console.log("Results from getCustomersByLogin: ");
            //console.log(context);
            complete();
        }
        
    })
}

function createOrder(context, order, mysql, complete)
{
    let query = "INSERT INTO orders(customerID, orderDate, shipStatus, trackingNumber) VALUES (?, ?, ?, ?) ";

    mysql.pool.query(query, [order.customerID, order.orderDate, order.shipStatus, order.trackingNumber], function(err, results, fields) {
        if (err) {
            console.log(err);
        }
        //console.log(results);
        context.orderID = results.insertId;
        console.log("Created Order...");
        complete();
    })
}

function createOrderItem(orderNumber, itemID, quantity, mysql, complete)
{
    let query = "INSERT INTO orderItems(orderNumber, itemID, quantity) VALUES (?, ?, ?) ";

    mysql.pool.query(query, [orderNumber, itemID, quantity], function(err, results, fields) {
        if (err) {
            console.log(err);
        }
        console.log("Created order item");
        complete();
    })
}

function getOrdersByCustomer(context, customerID, mysql, complete)
{
    let query = "SELECT orderNumber, orderDate, trackingNumber, shipStatus FROM orders INNER JOIN customers on orders.customerID = customers.customerID WHERE customers.customerID = ? ";

    mysql.pool.query(query, [customerID], function(err, results, fields) {
        if(err) {
            console.log(err);
        }
        
        context.orders = results;
        console.log("Get orders by customer succeeded...");
        complete();
    })
}


module.exports.getCustomers = getCustomers;
module.exports.getItems = getItems;
module.exports.getItemsBySport = getItemsBySport;
module.exports.getVendors = getVendors;
module.exports.addItem = addItem;
module.exports.deleteItem = deleteItem;
module.exports.updateItem = updateItem;
module.exports.getItemsByID = getItemsByID;
module.exports.addCustomer = addCustomer;
module.exports.deleteCustomer = deleteCustomer;
module.exports.addVendor = addVendor;
module.exports.getCustomersByID = getCustomersByID;
module.exports.updateCustomer = updateCustomer;
module.exports.getVendorsByID = getVendorsByID;
module.exports.updateVendor = updateVendor;
module.exports.getItemsByVendor = getItemsByVendor;
module.exports.deleteVendor = deleteVendor;
module.exports.getCustomerIDByLogin = getCustomerIDByLogin;
module.exports.createOrder = createOrder;
module.exports.createOrderItem = createOrderItem;
module.exports.getOrdersByCustomer = getOrdersByCustomer;
module.exports.getCustomersByLogin = getCustomersByLogin;