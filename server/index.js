require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { initPassport } = require("./config/passport");
const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

// Middleware packages
app.use("/user_items", express.static("user_items"));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
initPassport();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/wishlist", wishlistRoutes);

// The main shit
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Connected to DB and is listening to port ${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
