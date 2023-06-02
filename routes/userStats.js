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
  if (req.user.userId === req.params.id) {
    const filter = { userID: req.params.id };

    try {
      const updatedStats = await UserStats.findOneAndUpdate(
        filter,
        { $set: req.body },
        { new: true }
      );
      res.json({ status: "success", data: updatedStats });
    } catch (err) {
      res.json({ status: "fail", data: err.message });
    }
  }
});

//GET SPEICIFC USER STATS
router.get("/current", verify, async (req, res) => {
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
