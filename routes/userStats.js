const router = require("express").Router();
const UserStats = require("../models/UserStats");
const verify = require("../jwtverification/verification"); // verify token function

//CREATE USER STATS COLLECTION ON REGISTRATION
router.post("/register", verify, async (req, res) => {
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
  try {
    const stats = await UserStats.findById(req.params.id);
    if (stats.username === req.body.username) {
      try {
        const updatedStats = await UserStats.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.json({ status: "success", data: updatedStats });
      } catch (err) {
        res.json({ status: "fail", data: err.message });
      }
    } else {
      res.json({ status: "fail", data: "You cannot update these stats." });
    }
  } catch (err) {
    res.json({ status: "fail", data: err.message });
  }
});

//GET SPEICIFC USER STATS
router.get("/find", async (req, res) => {
  try {
    const userStats = await UserStats.find({ username: req.body.username });
    res.json({ status: "success", data: userStats });
  } catch (err) {
    res.json({ status: "fail", data: err.message });
  }
});

//GET ALL USER STATS
router.get("/alluserstats", async (req, res) => {
  try {
    const allUserStats = await UserStats.find({});
    res.json({ status: "success", data: allUserStats });
  } catch (err) {
    res.json({ status: "fail", data: err.message });
  }
});

module.exports = router;
