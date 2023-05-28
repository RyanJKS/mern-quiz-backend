const mongoose = require("mongoose");

// Original connection string needs to be modified for specific database collections

async function dbConnection() {
  try {
    await mongoose.connect(process.env.REACT_APP_MONGODB_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }
}

module.exports = dbConnection;
