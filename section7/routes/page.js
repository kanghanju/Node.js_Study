const express = require("express");

const router = express.Router();

router.get("/profile", (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

router.get("/", (req, res, next) => {
  const twits = [];
  res.render("main", {
    title: "NodeBird",
    twits,
    user: req.user, //유저가 있으면 메인페이지를 보여준다
  });
});

module.exports = router;
