const mongoose = require("mongoose");

const UserStatsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    wins: {
      type: Number,
      required: true,
    },
    totalGamesPlayed: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
const UserStats = mongoose.model("UserStats", UserStatsSchema);
module.exports = UserStats;
