exports.isLoggedIn = (req, res, next) => {
  //미들웨어 함수를 만든다
  //로그인 되어있으면 next()
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  //미들웨어 함수를 만든다
  //로그인 안되어있으면 next()
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};
