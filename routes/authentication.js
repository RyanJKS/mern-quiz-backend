// calls the router function from express
const router = require("express").Router();
const Users = require("../models/Users");
const bcrypt = require("bcrypt"); // used to hash passwords
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

//REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = await Users.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.json({ status: "success", data: user });
  } catch (err) {
    res.json({ status: "fail", data: err.message });
  }
});

//LOGIN USER
router.post("/login", async (req, res) => {
  try {
    //find user based on username
    const user = await Users.findOne({ username: req.body.username });
    //check if password matches
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (user && isPasswordMatch) {
      // generate token from jwt & send it to client to store in localStorage
      const accessToken = await jwt.sign(
        { username: user.username, password: user.password, userId: user._id },
        process.env.REACT_APP_JWT_SECRET_WORD
      );
      // remove password from user object and return remainder of user data - return only "others"
      const { email, password, createdAt, updatedAt, ...others } = user._doc;

      res.json({ status: "success", data: others, token: accessToken });
    } else {
      res.json({ status: "fail", data: "Wrong Credentials" });
    }
  } catch (err) {
    res.json({ status: "fail", data: err.message });
  }
});

//exports the router to be used in index file
module.exports = router;
