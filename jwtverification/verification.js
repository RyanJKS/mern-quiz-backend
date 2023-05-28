const jwt = require("jsonwebtoken");

// next means everythign continues after this function has been called
const verify = (req, res, next) => {
  const token = req.headers.authorisation;

  if (token) {
    jwt.verify(token, process.env.REACT_APP_JWT_SECRET_WORD, (err, user) => {
      if (err) {
        return res.json({ status: "fail", data: "Token invalid" });
      }
      //return payload user which was defined when the token is created on sign in
      req.user = user;
      next();
    });
  } else {
    res.json({ status: "fail", data: "Token not verified" });
  }
};

module.exports = verify;
