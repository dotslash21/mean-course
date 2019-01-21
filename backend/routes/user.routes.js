const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const router = express.Router();

SECRET_KEY =
  "MIICXAIBAAKBgQCVBj1ltpZm76I7Uj2CwRmxqmu6NhLmko1JSCFRHKlsWryphrqXkQrDw5f5lH6NPrDphJneflSmtoS3s6Kaqz3e5GpRiwTMFdDC+ndnNJ9SqyIonUJ8mWF0bbz2dmnMk3cKqtShE0h82WuN7mGBvwFYVqQNEY6ESDrXsITkhbZBnQIDAQABAoGAK4I83rtmQftoxCUIrGowVDzLYvxynDrhYSncAFB77pS3TE93ntTL7cfnUQjXwekxwZvjSKBdmqbjLLcXnEyurTcun25IKxIYMEHFJSCyZ77ntRXKUYqknqMl01rCBLNmSu8BGMHUoxFFqpFSQbINfeCm5AMs4wWm+iZrO8UZIECQQDmM07EWLzdGehD0gNf61ByI9NaC28B8Spsg1YV9KzBaPywXVKX7jfDAbmWN0Nh3mQsUxYMzWj9fHqA4xm4QHRAkEApbnn7M789ffh6ZLjCunpEek2gQByXCTKfXKkorCke7y1BfCr5eKZ55ThItxuSnac9US6Ew4xDTrZbYcKDQJAaaK90IhQEr4iwaFR9ST184rRIA8DH8cFisoyJN0ksZR18JDCqAme+ROkFlHyI9NHkLHfOaBRJOv7+3tIQJAcjvA5SNXodXZvNzo7z7oztXIIgeizGz3vpzlqicPkvP4IcX3Bn4YgvAZdYWA8DcvQywH89G6FuokXsV0Z3hiQJBAOGnStfI2jpDmELFH2wj+tU5ka8CGHO2Ns0UOefCWiPGseJQDtc3RlsRrqkTLwaJqK9MgIwMoKxDLV+utsF52DU=";

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "New user created successfully!",
          result: result
        });
      })
      .catch(error => {
        res.status(500).json({
          error: error
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      fetchedUser = user;
      if (!user) {
        return res.status(401).json({
          message: "User authentication failed!"
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "User authentication failed!"
        });
      }

      // Authentication successful create token
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: "User authentication successful!",
        token: token,
        expiresIn: "3600"
      });
    })
    .catch(error => {
      return res.status(401).json({
        message: "User authentication failed!"
      });
    });
});

module.exports = router;
