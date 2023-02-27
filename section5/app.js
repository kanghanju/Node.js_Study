const express = require("express");
//경로처리 할때는 확실하게 path모듈을 쓴다
const path = require("path");

//express로부터 app을 가져온다
const app = express();

//port라는 속성을 3000으로 설정한다, process.env.PORT 변수가 설정되어 있지 않으면 기본값으로 3000포트 사용
app.set("port", process.env.PORT || 3000);

//공통 미들웨어
app.use(
  (req, res, next) => {
    console.log("모든 요청에 실행하고 싶어요");
    next();
  }
  /* (req, res,next) => {
    try{
      console.log(adlskfadkfj);
    }catch(error){
      next(error); next의 인수에 error가 들어가면 error라고 처리되어서 error처리 미들웨어로 찾아간다
    }
  }*/
);

//라우터
//if문 안써도 분기처리가 잘 되어있다
app.get("/", (req, res) => {
  //join은 상대경로로 처리, __dirname: 현재 디렉토리 경로
  res.sendFile(path.join(__dirname, "./index.html"));
  //!!!!!!한 라우터에 send는 1번만 하라!!!!!!!(Error:Cannnot set headers after they are sent to the client)
  //res.send("안녕하세요");
  //res.json({hello:'hanju'});  응답을 보낼뿐이지 함수 자체를 종료하는 것은 아니다(return없음), res.end(JSON.stringify({hello:'hanju'}));
  //res.render();
  //res.writeHead(200,{'Content-Type...}),res.end() => express가 편하게 두개를 합쳐 res.send()로 만든거다!
});

app.get("/about", (req, res) => {
  res.send("hello express");
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
