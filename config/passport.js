const queries = require("../database/queries.js");
//const mysql = require("../database/dbcon-dev.js");
const mysql = require("../database/dbcon.js");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

module.exports = function (app) {

    app.use(passport.initialize());

    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user.customerID);
    });


    passport.deserializeUser(function(id, done) {
        
        let context = {};
        context.customers = null;
        queries.getCustomersByID(context, id, mysql, complete)
        function complete() {
            done(null, context.customers[0]);
        }
    });
    
    passport.use(new LocalStrategy(

        function(username, password, done) {

            let context = {};
            context.err = null;
            context.results = null;

            queries.getCustomersByLogin(context, username, mysql, complete);
            function complete() {
            
                // handle err in request
                if (context.err) {
                    return done(context.err, false);
                }

                // handle no results found
                if (!context.results[0]) {
                    return done(null, false);
                }

                let salt = context.results[0].salt;

                let testPassword = salt + password;

                let encryptPassword = crypto.createHash('sha256').update(testPassword).digest('hex');

                let dbPassword = context.results[0].hash;

                if (dbPassword != encryptPassword) {
                    return done(null, false);
                }
                else if (dbPassword == encryptPassword) {
                    console.log(context);
                    return done(null, context.results[0]);
                }
            }
        } 
    ));

}