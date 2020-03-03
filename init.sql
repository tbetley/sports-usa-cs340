-- Sports USA Data Tables

-- Set key checks and drop tables
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS orderItems;
SET FOREIGN_KEY_CHECKS = 1;

-- Create Tables
CREATE TABLE customers (
    customerID int NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    phoneNumber varchar(255) NOT NULL,
    logIn varchar(255) NOT NULL,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    streetAddress varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    zip int NOT NULL,
    state varchar(255) NOT NULL,
    PRIMARY KEY (customerID)
);

CREATE TABLE orders (
    orderNumber int NOT NULL AUTO_INCREMENT,
    customerID int NOT NULL,
    orderDate DATE NOT NULL,
    shipStatus varchar(255) NOT NULL,
    trackingNumber varchar(255) NOT NULL,  
    PRIMARY KEY (orderNumber),
    FOREIGN KEY (customerID) REFERENCES customers(customerID)
);

CREATE TABLE vendors (
    vendorID int NOT NULL AUTO_INCREMENT,
    vendorName varchar(255) NOT NULL,
    website varchar(255) NOT NULL,
    phoneNumber varchar(255) NOT NULL,
    PRIMARY KEY (vendorID)
);

CREATE TABLE items (
    itemID int NOT NULL AUTO_INCREMENT,
    vendorID int NOT NULL,
    itemName varchar(255) NOT NULL,
    price varchar(255) NOT NULL,
    quantity int NOT NULL,
    type varchar(255) NOT NULL,
    sport varchar(255) NOT NULL,
    PRIMARY KEY (itemID),
    FOREIGN KEY (vendorID) REFERENCES vendors(vendorID)
);

CREATE TABLE orderItems (
    orderNumber int NOT NULL,
    itemID int NOT NULL,
    quantity int NOT NULL,
    FOREIGN KEY (orderNumber) REFERENCES orders(orderNumber),
    FOREIGN KEY (itemID) REFERENCES items(itemID),
    CONSTRAINT PK_orderItem PRIMARY KEY (orderNumber, itemID)
);

--Add New Item
INSERT INTO items (vendorID, itemName, price, quantity, type, sport) VALUES (:vendorInput, :itemInput, :priceInput, :quantityInput, :typeInput, :sportInput);
​
--Add New Vendor
INSERT INTO vendors (vendorName, website, phoneNumber) VALUES :vendorNameInput, :websiteInput, :numberInput);
​
--Add New Customer
INSERT INTO customers (email, phoneNumber, logIn, firstName, lastName, streetAddress, city, zip, state) 
VALUES (:emailInput, :numberInput, :logInput, :fnameInput, :lastNameInput, :addressInput, :cityInput, :zipInput, :stateInput);

--Delete an Item
Delete FROM items WHERE itemId = :itemDeletionSelection;
​
--Delete a Vendor
Delete FROM vendors WHERE vendorID = :vendorDeletionSelection;
​
--Delete a Customer
Delete FROM customers WHERE customerID = :customerDeletionSelection;
​
--Update a Customer
UPDATE customers SET email = :emailInput, phoneNumber= :numberInput, logIn = :logInput, firstName= :fnameInput, lastName = :lastNameInput, streetAddress = :addressInput, city = :cityInput, zip = :zipInput, state = :stateInput WHERE id= :customer_ID_from_the_update_form;
​
--Update a Vendor
UPDATE vendors SET vendorName = :vendorNameInput, website = :websiteInput, phoneNumber= :numberInput) WHERE vendorID = vendorID_selected_from_form;

--Update an Item
UPDATE items SET vendorID = :vendorInput, itemName = :itemInput, price=:priceInput, quantity = :quantityInput, type = :typeInput, sport = :sportInput WHERE itemId = item_ID_selected_from;
​
INSERT INTO customers (email, phoneNumber, logIn, firstName, lastName, streetAddress, city, zip, state) 
VALUES ("bob@bob.com", "685-489-2343", "bob473", "Bob", "Bobero", "123 State Street", "Manhattan", 44345, "New York");
​
INSERT INTO customers (email, phoneNumber, logIn, firstName, lastName, streetAddress, city, zip, state) 
VALUES ("Kevin@Kevin.com", "685-489-2343", "Kevin3224", "Kevin", "Kevinero", "432 State Street", "Manhattan", 74355, "Kansas");
​
INSERT INTO vendors (vendorName, website, phoneNumber) VALUES ("Nike", "nike.com", "390-999-0000");
​
INSERT INTO vendors (vendorName, website, phoneNumber) VALUES ("Champion", "champ.com", "900-939-0300");

INSERT INTO items (vendorID, itemName, price, quantity, type, sport) VALUES ((SELECT vendorID FROM vendors WHERE vendorName="Nike"), "Patriots T-Shirt", "$48.38", 19, "Apparel", "Football");