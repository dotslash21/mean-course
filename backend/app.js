const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require("./routes/posts.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

mongoose
  .connect(
    "mongodb+srv://dotslash21:" +
      process.env.MONGO_ATLAS_PW +
      "@testzone51-ksuva.mongodb.net/mean-course?retryWrites=true"
  )
  .then(() => {
    console.log("Database connection established successfully!");
  })
  .catch(error => {
    console.log("Database connection failed!", error.message);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // Example
app.use("/images", express.static(path.join("backend/images")));

// Set headers for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
