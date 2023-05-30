// calls the router function from express
const router = require("express").Router();
const Users = require("../models/Users");
const UserStats = require("../models/UserStats");
const bcrypt = require("bcrypt"); // used to hash passwords
const verify = require("../jwtverification/verification"); // verify token function

//UPDATE USER
router.put("/update/:id", verify, async (req, res) => {
  // after function verify, then you can see the req.body data
  // intial if statement is not needed but can be used for double validation
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.json({ status: "success", data: updatedUser });
    } catch (err) {
      res.json({ status: "fail", data: err.message });
    }
  }
});

//DELETE USER
router.delete("/delete/:id", verify, async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      //find user by id
      const user = await Users.findById(req.params.id);

      try {
        //find and delete all user stats
        await UserStats.deleteMany({ username: user.username });
        await Users.findByIdAndDelete(req.params.id);
        res.status(200).json("Account & Contents Deleted Successfully");
      } catch (err) {
        res.json({ status: "fail", data: err.message });
      }
    } catch (err) {
      res.json({ status: "fail", data: "User not found." });
    }
  } else {
    res.json({ status: "fail", data: "You can only delete your own account" });
  }
});

//GET ALL USERS
router.get("/allusers", async (req, res) => {
  try {
    const allUsers = await Users.find({});
    res.json({ status: "success", data: allUsers });
  } catch (err) {
    res.json({ status: "fail", data: err.message });
  }
});

//exports the router to be used in index file
module.exports = router;
