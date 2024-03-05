const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const DB = require("./Database.js");
const app = express();
app.use(express.json());
app.use(cors());
let port = 8000;

const AddUser = require("./routes/addUser");
const DeleteUser = require("./routes/deleteUser");
const ReadUsers = require("./routes/readUsers");
const UpdateUser = require("./routes/updateUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use("/", AddUser);
app.use("/", DeleteUser);
app.use("/", ReadUsers);
app.use("/", UpdateUser);

app.post("/register", async (req, res) => {
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
            console.log(hashPassword);
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

app.post("/login", async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    res.status(400).send("Enter all required fields");
  } else {
    DB.query(
      `SELECT * FROM users WHERE Email = ?`,
      [Email],
      async (err, result) => {
        if (err) {
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
              res.status(400).send("Invalid Password");
            }
          } else {
            res.status(400).send("Invalid Email");
          }
        }
      }
    );
  }
});

app.listen(8000, () => console.log(">>>>", 8000));
