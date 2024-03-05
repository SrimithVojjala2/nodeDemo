const express = require("express");
const router = express.Router();
const DB = require("../Database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { Username, Firstname, Lastname, Email, Password } = req.body;
  const EmailVerify = /\S+@\S+\.\S+/;
  if (!Email || !Username || !Firstname || !Lastname || !Password) {
    res.status(400).send("Enter all required fields");
  } else if (!EmailVerify.test(Email)) {
    res.status(400).send("Invalid Email");
  } else {
    DB.query(
      `SELECT * FROM users WHERE Email = ?`,
      [Email],
      async (err, result) => {
        if (err) {
          return false;
        } else {
          if (result.length > 0) {
            res.status(400).send("Email already exists");
          } else {
            const hashPassword = await bcrypt.hash(Password, 10);
            DB.query(
              `INSERT INTO users (email,password) VALUES (?,?)`,
              [Email, hashPassword],
              (err, result) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  const user = { Email: Email };
                  const jwtToken = jwt.sign(user, process.env.JWT_SECRET_TOKEN);
                  DB.query(
                    `INSERT INTO userdetails (Username,Firstname,Lastname,Email) VALUES (?,?,?,?)`,
                    [Username, Firstname, Lastname, Email],
                    (err, result) => {
                      if (err) {
                        res.status(500).send(err);
                      } else {
                        res.status(200).send({
                          token: jwtToken,
                          user: user,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  }
});

router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    res.status(400).send("Enter all required fields");
  } else {
    DB.query(
      `SELECT * FROM users WHERE Email = ?`,
      [Email],
      async (err, result) => {
        if (err) {
          console.error(err);
          return false;
        } else {
          if (result.length > 0) {
            const validPassword = await bcrypt.compare(
              Password,
              result[0].password
            );
            if (validPassword) {
              const user = { Email: Email };
              const jwtToken = jwt.sign(user, process.env.JWT_SECRET_TOKEN);
              res.status(200).send({
                token: jwtToken,
                user: user,
              });
            } else {
              res.status(401).send("Invalid Password");
            }
          } else {
            res.status(401).send("Invalid Email. Please register first.");
          }
        }
      }
    );
  }
});

module.exports = router;
