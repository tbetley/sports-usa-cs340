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
    salt varchar(255) NOT NULL,
    hash varchar(255) NOT NULL,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    streetAddress varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    zip int NOT NULL,
    state varchar(255) NOT NULL,
    isAdmin boolean NOT NULL,
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
    image varchar(255),
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
