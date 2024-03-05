const mysql = require("mysql2");
const dotenv = require("dotenv");
const e = require("express");
dotenv.config();
const DB = mysql.createConnection({
  host: "localhost",
  database: "user_data",
  user: "root",
  password: "root"
});

DB.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + DB.threadId);
});

module.exports = DB;
