const express = require("express");
require("dotenv").config();
const cors = require("cors");
const dbConnection = require("./config/config");
const authenticationRoute = require("./routes/authentication");
const apiRouter = require("./routes/quizApi");
const userRouter = require("./routes/users");
const userStatsRouter = require("./routes/userStats");

const app = express();
app.use(express.json());
app.use(cors());

dbConnection();

//intro
app.get("/", (req, res) => {
  res.json(
    "Welcome to the MongoDB database for the quiz app! - Created by Jhelan"
  );
});

app.use("/user/authentication", authenticationRoute); // router to authentication process
app.use("/user", userRouter); // router to user database
app.use("/user/stats", userStatsRouter); // router to user stats database
app.use("/api", apiRouter); //quiz api route

app.listen(3001, () => console.log("Server running on port 3001"));
