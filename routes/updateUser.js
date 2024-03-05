const express = require("express");
const router = express.Router();


const DB = require("../Database.js");

router.post("/users/updateUser", function (req, res) {
  const { Username, Email, Firstname, Lastname } = req.body;
    if (!Email || !Username || !Firstname || !Lastname) {
        res.status(400).send("Enter all required fields");
    } else {
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
    }
});

module.exports = router;
