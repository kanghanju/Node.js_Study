const express = require("express");
const cookieParser = require("cookie-parser");
//HTTP요청을 콘솔에 기록하는  미들웨어(디버깅 및 모니터링 목적)
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
//.env 파일에서 process.env객체로 환경 변수를 로드한 다음 애플리케이션 전체에서 액세스 할 수 있다
//API키,데이터베이스 자격 증명 또는 기타 구성 설정과 같은 민감한 데이터를 안전한 방식으로 저장한다
const dotenv = require("dotenv");

//dotenv.config() 함수는 .env 파일에서 process.env 객체로 환경 변수를 로드합니다. 이 함수는 환경 변수를 사용하는 다른 코드보다 먼저 Node.js 애플리케이션의 시작 부분에서 호출해야 합니다.
//dotenv.config()를 호출하면 패키지가 .env 파일을 읽고 내용을 구문 분석하여 process.env 객체의 해당 키에 값을 할당합니다
dotenv.config();
const pageRouter = require("./routes/page");

const app = express();
//개발할때와 배포할때의 port를 다르게 설정하기위해 ||사용
app.set("port", process.env.PORT || 8001);
//view rendering에 nunjucks 템플릿 엔진을 사용할 거다! , view 템플릿의 확장자는 .html확장자를 사용한다
app.set("view engine", "html");
nunjucks.configure("views", {
  //nunjucks가 express와 함께 작동하도록 구성한다
  express: app, //Express애플리케이션의 인스턴스
  watch: true, //템플릿 파일의 변경 사항을 감시하고 변경 시 자동으로 다시 로드해준다:true
});

//각 요청에 대한 정보를 dev 형식을 사용해 콘솔에 기록한다. dev형식: HTTP메서드,URL,응답 상태,응답 시간 등과 같은 세부정보
app.use(morgan("dev"));
//정적인 파일들을 제공하는 미들웨어
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); //express.json() 미들웨어 함수는 들어오는 요청의 Content-Type 헤더가 application/json으로 설정된 경우 들어오는 요청 본문을 JSON 형식으로 구문 분석합니다. 구문 분석된 JSON 데이터는 경로 핸들러에서 액세스할 수 있는 req.body 객체에 추가됩니다.
app.use(express.urlencoded({ extended: true })); //express.urlencoded() 미들웨어 함수는 들어오는 요청의 Content-Type 헤더가 application/x-www-form-urlencoded로 설정된 경우 들어오는 요청 본문을 구문 분석합니다. 그런 다음 구문 분석된 데이터가 req.body 객체에 추가됩니다.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

//pageRouter연결
app.use("/", pageRouter);

//404처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

//에러 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message; //템플릿엔진에서 message,error라는 변수를 쓸 수 있게 해줌
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error"); //error.html render
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
