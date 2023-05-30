const mongoose = require("mongoose");

const UserStatsSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    totalGamesPlayed: {
      type: Number,
      required: true,
    },
    winPercentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
const UserStats = mongoose.model("UserStats", UserStatsSchema);
module.exports = UserStats;
