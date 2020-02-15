const mysql = require("mysql");
var parseDbUrl = require("parse-database-url");
var dbConfig = parseDbUrl(process.env["DATABASE_URL"]);
const pool = mysql.createPool(dbConfig);

module.exports.pool = pool;