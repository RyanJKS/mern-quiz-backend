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
const generateAccessToken = async (user) => {
  const tokenData = { username: user.username, userId: user._id };
  return jwt.sign(tokenData, process.env.REACT_APP_JWT_SECRET_WORD, {
    // expiresIn: "10m",
  });
};

// //GENERATE REFRESH TOKEN ON LOGIN FUCNTION
// const generateRefreshToken = async (user) => {
//   const tokenData = { username: user.username, userId: user._id };
//   return jwt.sign(tokenData, process.env.REACT_APP_JWT_REFRESH_SECRET_WORD);
// };

// let refreshTokenList = [];
// router.post("/refresh-token", async (req, res) => {
//   //take refresh token form user
//   const refreshToken = req.body.token;
//   // send eror if there is no token
//   if (!refreshToken) return res.status(401).json("You are not authenticated");
//   if (!refreshTokenList.includes(refreshToken)) {
//     return res.status(403).json("Refresh token is not valid");
//   }
//   jwt.verify(
//     refreshToken,
//     process.env.REACT_APP_JWT_REFRESH_SECRET_WORD,
//     (err, user) => {
//       err && console.log(err);

//       refreshTokenList = refreshTokenList.filter(
//         (token) => token !== refreshToken
//       );

//       const newAccessToken = generateAccessToken(user);
//       const newRefreshToken = generateRefreshToken(user);
//       refreshTokenList.push(newRefreshToken);

//       res
//         .status(200)
//         .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
//     }
//   );

//   //if everything okay, create new token, refresh token and send to user
// });

// router.post("/login", async (req, res) => {
//   try {
//     //find user based on username
//     const user = await Users.findOne({ username: req.body.username });
//     //check if password matches
//     const isPasswordMatch = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );

//     if (user && isPasswordMatch) {
//       // generate token from jwt & send it to client to store in localStorage
//       const accessToken = await generateAccessToken(user);
//       const refreshToken = await generateRefreshToken(user);
//       refreshTokenList.push(refreshToken);

//       // remove password from user object and return remainder of user data - return only "others"
//       const { password, createdAt, updatedAt, ...others } = user._doc;

//       res.status(200).json({
//         data: others,
//         token: accessToken,
//         refreshToken: refreshToken,
//       });
//     } else {
//       res.status(400).json("Wrong Credentials");
//     }
//   } catch (err) {
//     res.status(400).json(err.message);
//   }
// });

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
