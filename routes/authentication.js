const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");
const UserDTO = require("../dto/UserDTO");

router.post("/signup", async (req, res) => {
  try {
    User.findOne({ userId: req.body.userId })
      .exec()
      .then(async (findUser) => {
        if (!findUser) {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            userId: req.body.userId,
            password: hashedPassword,
            highestScore: 0,
          });
          user
            .save()
            .then((data) => {
              console.log("signup successful");
              res.sendStatus(201);
            })
            .catch((err) => {
              res.status(500).json({
                message: "Sign Up unsuccessful. Please try again",
                error: err.message,
              });
            });
        } else {
          res.status(409).json({
            message:
              "username already exists. Please try again with different username",
          });
        }
      });
  } catch (err) {
    res.status(500).json({ message: "Internal servor error" });
  }
});

router.post("/login", (req, res) => {
  const userId = req.body.userId;
  const password = req.body.password;
  const user = User.findOne({ userId: userId }).exec();
  user
    .then(async (data) => {
      if (data != null) {
        try {
          if (await bcrypt.compare(password, data.password)) {
            console.log("login successful");
            const accessToken = jwt.sign(
              { user: new UserDTO(data) },
              process.env.ACCESS_TOKEN_SECRET
            );
            res.status(200).json(accessToken);
          } else {
            console.log("login unsuccessful");
            res.status(404).json({
              title: "Login unsuccessful",
              message: "Incorrect password",
            });
          }
        } catch (e) {
          console.log(e);
          res.status(500).json(e);
        }
      } else {
        console.log("login unsuccessful");
        res.status(404).json({
          title: "Login unsuccessful",
          message: "Incorrect username",
        });
      }
    })
    .catch((err) => {
      res.status(500, { message: err.message });
    });
});

router.get("/", (req, res) => {
  res.send("Hello");
});

module.exports = router;
