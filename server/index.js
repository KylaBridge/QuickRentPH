require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");

// Middlewares
// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);

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
