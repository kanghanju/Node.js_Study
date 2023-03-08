const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

//로그인 안한사람만 접근할 수 있음
router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    //기존에 이메일로 가입한 사람이 있나 확인
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("./join?error=exist");
    }
    //비밀번호를 저장할때 해쉬화해서 저장한다
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    //다시 메인페이지로 돌려보낸다
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//로그인 하는 것도 로그인 안한사람들만 할 수 있게 해야함
router.post("/login", isNotLoggedIn, (req, res, next) => {
  //passport가 LocalStrategy를 찾는다
  //done함수 호출시 (서버쪽 에러, 유저객체,로그인 실패시메시지)
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      //로그인 실패시 메시지를 담아서 프론트에게 보내준다
      return res.redirect(`/?loginError=${info.message}`);
    }
    //req.login()함수는 passport index.js로 간다
    return req.login(user, (loginError) => {
      //index.js의 done함수 실행시 (loginError)뒷부분 실행
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      //세션 쿠키를 브라우저로 보내준다
      //에러 없으면 로그인 성공
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

//로그인 한 사람만 로그아웃 할 수있게 해야한다
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(); //세션 쿠키가 사라진다
  req.session.destroy();
  res.redirect("/");
});

//카카오톡 로그인, kakaoStrategy로 가기 전에 카카오홈페이지로 가서 카카오 로그인을 한다
router.get("/kakao", passport.authenticate("kakao")); //kakaoStrategy로 이동

//로그인 성공시, 카카오가 /kakao/callback으로 요청을 한다
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    //카카오 로그인 성공하면 여기로 온다
    res.redirect("/");
  }
);

module.exports = router;
