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


module.exports.getCustomers = getCustomers;
module.exports.getItems = getItems;
module.exports.getItemsBySport = getItemsBySport;
module.exports.getVendors = getVendors;
module.exports.addItem = addItem;
module.exports.deleteItem = deleteItem;