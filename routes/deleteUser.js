const express = require("express");
const router = express.Router();

const DB = require("../Database.js");

router.post("/users/deleteUser", function (req, res) {
  const { Email } = req.body;
  if (!Email) {
    res.status(400).send("Email is required");
  } else {
    DB.query(
      `DELETE FROM userdetails WHERE Email = ?`,
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
});

module.exports = router;
