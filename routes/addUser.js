const express = require("express");
const router = express.Router();

const DB = require("../Database.js");

router.post("/users/addUser", function (req, res) {
  const { Username, Email, Firstname, Lastname } = req.body;
  const EmailVerify = /\S+@\S+\.\S+/;
  if (!Email || !Username || !Firstname || !Lastname) {
    res.status(400).send("Enter all required fields");
  } else if (!EmailVerify.test(Email)) {
    res.status(400).send("Invalid Email");
  } else {
    DB.query(
      `SELECT * FROM userdetails WHERE Email = ?`,
      [Email],
      (err, result) => {
        if (err) {
          return false;
        } else {
          if (result.length > 0) {
            res.status(400).send("Email already exists");
          } else {
            DB.query(
              `INSERT INTO userdetails (Username, Email, Firstname, Lastname) VALUES (?,?,?,?)`,
              [Username, Email, Firstname, Lastname],
              (err, result) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).send("User added successfully");
                }
              }
            );
          }
        }
      }
    );
  }
});

module.exports = router;
