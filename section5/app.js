const express = require("express");
//경로처리 할때는 확실하게 path모듈을 쓴다
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();
const indexRouter = require("./routes");
const userRouter = require("./routes/user");

//express로부터 app을 가져온다
const app = express();

//port라는 속성을 3000으로 설정한다, process.env.PORT 변수가 설정되어 있지 않으면 기본값으로 3000포트 사용
app.set("port", process.env.PORT || 3000);

//미들웨어(순서 처리 조심)
app.use(morgan("dev"));

//html,css,js같은 정적파일을 제공하는 미들웨어 , (요청경로,실제경로)
//localhost:3030/zerocho.html          learn-express/public-3030/zerocho.html
app.use("/", (req, res, next) => {
  // 미들웨어 확장하기
  if (req.session.id)
    // 세션 아이디가 있다면 (로그인 상태라면)
    //req.session이 정의되지 않은 상태에서 req.session.id를 읽으려고 해 error가 발생함
    express.static(path.join(__dirname, "public-3030"))(req, res, next);
  else next();
});

//데이터 파싱
app.use(express.json()); //클라이언트에서 json데이터를 보냈을 때  json데이터 파싱
app.use(express.urlencoded({ extended: true })); //클라이언트에서 form data보낼때 form 파싱하며 이미지,url은 처리 못한다

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
    },
    name: "connect.sid",
  })
);

//app.js가 길어지는 것을 막는다. userRouter의 get은 /user와 /가 합쳐져서 GET/user/가 된다
app.use("/", indexRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

//에러처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("에러났지롱");
});

//위에서 사용하는 get과 아래서 사용하는 get은 다른 메서드다
//Returns the value of name app setting, where name is one of the strings in the app settings table.
app.listen(app.get("port"), () => {
  console.log("익스프레스 서버 실행");
});
