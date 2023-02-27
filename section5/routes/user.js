const express = require("express");

const router = express.Router();

//GET /user 라우터, 앞에 붙는 주소를 조심해야한다
router.get("/", (req, res) => {
  res.send("hello user");
});

module.exports = router;
