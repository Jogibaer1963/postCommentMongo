const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({
        message: "success",
        result: result
        })
      })
      .catch(err => {
        res.status(500).json({
          message: "error",
          error: err
          })
      })
    })
})

router.post("/login", (req, res) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password)
      .then(result => {
        if (!result) {
          return res.status(400).json({ message: "Invalid password" });
        }
        const payload = {userId: fetchedUser._id, email: fetchedUser.email};
        jwt.sign(payload, process.env.JWT_SECRET,{ expiresIn: 3600 });
        res.status(200).json({token: token})
      })
      .catch(err => {
        return res.status(400).json({ message: "Invalid password" });
    })
  })
})

module.exports = router;
