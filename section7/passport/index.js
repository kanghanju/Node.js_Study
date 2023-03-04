const passport = requrie("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

//로그인을 어떻게 할지 로직을 써놓은 파일->전략이라고 부른다
module.exports = () => {
  //passport의 index.js로 오면 seriallizeUser함수 실행
  passport.serializeUser((user, done) => {
    done(null, user.id); //세션에 user의 id만 저장
    //done되면 auth.js실행
  });

  //{id:3,'connect.sid':s121948193503}

  //세션쿠키를 통해 id:3이라는걸 알아낸다
  //deserializeUser로 ((3,done))을 보내준다
  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user)) //req.user,req.isAuthenticated()
      .catch((err) => done(err));
  });

  local();
  kakao();
};
