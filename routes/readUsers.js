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

module.exports = router;
