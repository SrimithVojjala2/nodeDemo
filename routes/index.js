const express = require("express");
const router = express.Router();
const jwtVerification = require("./jwtVerification");
const DB = require("../Database.js");

router.get("/users", jwtVerification, function (req, res) {
  const { Email } = req.user;
  DB.query(
    "SELECT * FROM userdetails where Email= ?",
    [Email],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    }
  );
});

router.post("/users/deleteUser", jwtVerification, function (req, res) {
  const { Email } = req.body;
  const verifiedEmail = req.user.Email;
  if (!Email) {
    res.status(400).send("Email is required");
  } else {
    if (verifiedEmail === Email) {
      DB.query(
        `DELETE FROM userdetails WHERE Email = ?`,
        [Email],
        (err, result) => {
          if (err) {
            res.status(500).send(err);
          } else {
            DB.query(
              `DELETE FROM users WHERE Email = ?`,
              [Email],
              (err, result) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).send("User deleted successfully");
                }
              }
            );
          }
        }
      );
    } else {
      res.status(400).send("Invalid Email");
    }
  }
});

router.post("/users/updateUser", jwtVerification, function (req, res) {
  const { Username, Email, Firstname, Lastname } = req.body;
  const verifiedEmail = req.user.Email;
  if (!Email || !Username || !Firstname || !Lastname) {
    res.status(400).send("Enter all required fields");
  } else {
    if (verifiedEmail === Email) {
      DB.query(
        `UPDATE userdetails SET Username = ?, Firstname = ?, Lastname = ? WHERE Email = ?`,
        [Username, Firstname, Lastname, Email],
        (err, result) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send("User updated successfully");
          }
        }
      );
    } else {
      res.status(400).send("Invalid Email");
    }
  }
});

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
