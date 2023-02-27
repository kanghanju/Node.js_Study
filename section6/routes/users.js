const express = require("express");
const User = require("../models/user");
const Comment = require("../models/comment");

const router = express.Router();

router
  .route("/")
  //가져오기
  .get(async (req, res, next) => {
    try {
      const users = await User.findAll();
      //보통 다 json으로 보여준다
      res.json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  //등록하기
  .post(async (req, res, next) => {
    try {
      const user = await User.create({
        name: req.body.name,
        age: req.body.age,
        married: req.body.married,
      });
      console.log(user);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get("/:id/comments", async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    });
    console.log(comments);
    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
