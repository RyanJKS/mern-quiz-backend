const router = require("express").Router();
const axios = require("axios");

router.get("/getquiz", async (req, res) => {
  const options = {
    method: "GET",
    url: process.env.REACT_APP_API_URL,
    headers: {
      "X-RapidAPI-Key": process.env.REACT_APP_API_KEY,
      "X-RapidAPI-Host": process.env.REACT_APP_API_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
