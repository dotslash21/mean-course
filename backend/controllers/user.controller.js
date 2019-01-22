const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

exports.createUser = (req, res, next) => {
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
          message:
            "A user with the entered email already exists, please use another email!"
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      fetchedUser = user;
      if (!user) {
        return res.status(401).json({
          message:
            "User authentication failed, Invalid authentication credentials!"
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message:
            "User authentication failed, Invalid authentication credentials!"
        });
      }

      // Authentication successful create token
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: "User authentication successful!",
        token: token,
        expiresIn: "3600",
        userId: fetchedUser._id
      });
    })
    .catch(error => {
      return res.status(401).json({
        message: "User authentication failed!"
      });
    });
};
