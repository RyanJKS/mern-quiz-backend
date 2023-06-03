const router = require("express").Router();
const UserStats = require("../models/UserStats");
const verify = require("../jwtverification/verification"); // verify token function

//CREATE USER STATS COLLECTION ON REGISTRATION
router.post("/register", async (req, res) => {
  const initialStats = new UserStats(req.body);
  try {
    const userStats = await initialStats.save();
    res.json({ status: "success", data: userStats });
  } catch (err) {
    res.json({ status: "fail", data: err.message });
  }
});

//UPDATE STATS
router.put("/update/:id", verify, async (req, res) => {
  //double authentication 1 from id and 2 jwt token unpacked from verify function
  if (req.user.userId === req.params.id) {
    const query = { userID: req.params.id };
    const update = {
      $set: {
        totalPoints: req.body.totalPoints,
        totalGamesPlayed: req.body.totalGamesPlayed,
        winPercentage: req.body.winPercentage,
      },
      $push: {
        timePerGame: req.body.timePerGame,
      },
    };

    try {
      const updatedStats = await UserStats.findOneAndUpdate(query, update, {
        new: true,
      });
      res.status(200).json(updatedStats);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
});

//GET SPEICIFC USER STATS
router.get("/current", verify, async (req, res) => {
  // destructure req.user from verify function (unpack from jwt token)
  try {
    const userStats = await UserStats.find({ userID: req.user.userId });
    res.status(200).json(userStats);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

//GET ALL USER STATS
router.get("/all", async (req, res) => {
  try {
    const allUserStats = await UserStats.find({});
    res.status(200).json(allUserStats);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
