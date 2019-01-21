const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require("./routes/posts.routes");

const app = express();

mongoose
  .connect(
    "mongodb+srv://dotslash21:1rlnwYkgXo0IE0h8@testzone51-ksuva.mongodb.net/mean-course?retryWrites=true"
  )
  .then(() => {
    console.log("Database connection established successfully!");
  })
  .catch(() => {
    console.log("Database connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // Example
app.use("/images", express.static(path.join("backend/images")));

// Set headers for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
