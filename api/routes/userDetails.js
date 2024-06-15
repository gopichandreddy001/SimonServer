const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserDTO = require("../dto/UserDTO");

router.patch("/:userId", (req, res) => {
  console.log("patch");
  User.findOne({ userId: req.params.userId })
    .exec()
    .then((user) => {
      if (user) {
        user = Object.assign(user, req.body);
        user.save().then((data) => {
          console.log("user updated successfully", data);
          res.status(200).json("user updated successfully");
        });
      } else {
        res.status(404).json({ message: "No user found with given username" });
      }
    })
    .catch((err) => console.log(err));
});

router.get("/:userId", (req, res) => {
  const users = User.find({ userId: req.params.userId })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        data.forEach((item, idx) => (data[idx] = new UserDTO(item)));
        res.status(200).json({ data: data[0] });
      } else {
        res.status(404).json({ message: "No user found with given userID" });
      }
    });
});

module.exports = router;
