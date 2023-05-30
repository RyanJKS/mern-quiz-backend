// calls the router function from express
const router = require("express").Router();
const Users = require("../models/Users");
const bcrypt = require("bcrypt"); // used to hash passwords
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

//HTTP RESPONSE STATUS CODES (200 - OK, 400 - Client Error, 500 - Server Error)

//REGISTER USER
router.post("/register", async (req, res) => {
  const user = await Users.findOne({ username: req.body.username });
  if (!user) {
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
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    res.status(400).json("User already exists");
  }
});

//GENERATE TOKEN ON LOGIN FUCNTION
const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    { username: user.username, userId: user._id },
    process.env.REACT_APP_JWT_SECRET_WORD
  );
  return accessToken;
};

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
      const accessToken = await generateAccessToken(user);

      // remove password from user object and return remainder of user data - return only "others"
      const { password, createdAt, updatedAt, ...others } = user._doc;

      res.status(200).json({ data: others, token: accessToken });
    } else {
      res.status(400).json("Wrong Credentials");
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
});

//exports the router to be used in index file
module.exports = router;
