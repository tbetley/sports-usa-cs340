function getCustomers(context, mysql, complete)
{
    let query = "SELECT customerID, firstName, lastName, email, phoneNumber, logIn, streetAddress, city, zip, state FROM customers";
    mysql.pool.query(query, function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("Results from getCustomers Query:");
        console.log(results);
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
        console.log("Results from getItems Query:");
        console.log(results);
        context.items = results;
        complete();
    });
} 

function getItemsBySport(context, sport, mysql, complete)
{
    let query = "SELECT itemID, vendorName, itemName, price, quantity, type, sport FROM items JOIN vendors ON items.vendorID = vendors.vendorID WHERE items.sport = ? ";
    mysql.pool.query(query, [sport], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("Results from getItemsBySport Query:");
        console.log(results);
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
        console.log("Results from getItemsByID Query:");
        console.log(results);
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
        console.log("Results from getVendors Query:");
        console.log(results);
        context.vendors = results;
        complete();
    });
} 


function addItem(req, mysql, complete)
{
    console.log("Adding the following to Item Database: ")
    console.log(req);
    let query = 'INSERT INTO items (vendorID, itemName, price, quantity, type, sport) VALUES ((SELECT vendorID FROM vendors WHERE vendorName=?), ?, ?, ?, ?, ?)';

    mysql.pool.query(query, [req.vendor, req.itemName, req.price, req.quantity, req.type, req.sport], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("Rows changed: " + results.affectedRows);
        complete();
    });
}

function deleteItem(itemID, mysql, complete)
{
    console.log("Deleting the Item with ID: " + itemID);
    mysql.pool.query("DELETE FROM items WHERE itemID=? ", [itemID], function(err, result) {
        if (err)
        {
            console.log(err);
        }
        //console.log("Records changed: " + result.affectedRows);
        complete();
    });
}

function updateItem(req, mysql, complete)
{
    console.log("Updating the following to Item Database: ")
    console.log(req);
    //let query = "Update items (itemName, price, quantity, type, sport) SET (?, ?, ?, ?, ?) WHERE itemID=?";
    let query = "UPDATE items SET itemName=?, price=?, quantity=?, type=?, sport=? WHERE itemID=? ";
    mysql.pool.query(query, [req.itemName, req.price, req.quantity, req.type, req.sport, req.itemID], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("Rows changed: " + results.affectedRows);
        complete();
    });
}

function addCustomer(req, mysql, complete)
{
    console.log("Adding the following to Customer Database: ")
    console.log(req);
    let query = "INSERT INTO customers (email, phoneNumber, logIn, firstName, lastName, streetAddress, city, zip, state) values (?, ?, ?, ?, ?, ?, ?, ?, ?) ";

    mysql.pool.query(query, [req.email, req.phoneNumber, req.logIn, req.firstName, req.lastName, req.streetAddress, req.city, req.zip, req.state], function(err, results, fields) {
        if (err) {
            console.log(err);
            complete();
        }
        console.log("Rows changed: " + results.affectedRows);
        complete();
    });
}

function deleteCustomer(customerID, mysql, complete)
{
    console.log("Deleting the Customer with ID: " + customerID);
    mysql.pool.query("DELETE FROM customers WHERE customerID=? ", [customerID], function(err, result) {
        if (err)
        {
            console.log(err);
        }
        //console.log("Records changed: " + result.affectedRows);
        complete();
    });
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