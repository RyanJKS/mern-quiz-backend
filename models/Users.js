const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
//Model name is "User" and will be required in other files
module.exports = mongoose.model("Users", userSchema);
