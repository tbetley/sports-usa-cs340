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

// Tell express to use public folder to serve assets
app.use(express.static("public"));

// local port
const PORT = process.env.PORT || 5000;

/***********************************
 * ROUTES
************************************/
app.get("/", function (req, res) {
    res.render("home.ejs");
})

app.listen(PORT, function() {
    console.log(`Server Running on PORT: ${PORT}`);
})