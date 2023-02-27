const express = require("express");
//경로처리 할때는 확실하게 path모듈을 쓴다
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");

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

app.use(cookieParser("secretcode"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secretcode",
    cookie: {
      httpOnly: true,
    },
    name: "connect.sid",
  })
);

//데이터 파싱
app.use(express.json()); //클라이언트에서 json데이터를 보냈을 때  json데이터 파싱
app.use(express.urlencoded({ extended: true })); //클라이언트에서 form data보낼때 form 파싱하며 이미지,url은 처리 못한다

//라우터
//if문 안써도 분기처리가 잘 되어있다
app.get("/", (req, res) => {
  /* req.cookies; //{mycookie:'test'}
  //"Set-Cookie": `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`
  res.cookie("name", encodeURIComponent(name), {
    expires: new Date(),
    httpOnly: true,
    path: "/",
  });*/

  //방금 요청을 보낸 사람의 id만 hello가 된다, 요청을 자꾸 보내도 나임을 기억했으면 좋겠다 = req.session(유지되고 싶은 데이터)
  req.session.id = "hello";

  //join은 상대경로로 처리, __dirname: 현재 디렉토리 경로
  res.sendFile(path.join(__dirname, "./index.html"));
  //!!!!!!한 라우터에 send는 1번만 하라!!!!!!!(Error:Cannnot set headers after they are sent to the client)
  //res.send("안녕하세요");
  //res.json({hello:'hanju'});  응답을 보낼뿐이지 함수 자체를 종료하는 것은 아니다(return없음), res.end(JSON.stringify({hello:'hanju'}));
  //res.render();
  //res.writeHead(200,{'Content-Type...}),res.end() => express가 편하게 두개를 합쳐 res.send()로 만든거다!
});

app.get("/about", (req, res) => {
  res.status(200).send("hello express");
});

app.post("/", (req, res) => {
  res.send("hello express");
});

//에러처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(200).send("에러났지롱");
});

//위에서 사용하는 get과 아래서 사용하는 get은 다른 메서드다
//Returns the value of name app setting, where name is one of the strings in the app settings table.
app.listen(app.get("port"), () => {
  console.log("익스프레스 서버 실행");
});
