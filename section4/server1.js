//노드가 http 서버를 쉽게 만들도록 제공
const http = require("http");

//http 요청에 응답하는 서버
const server = http
  .createServer((req, res) => {
    //클라이언트가 받을 데이터가 어떤 형식인지 브라우저에게 알려주어 적절하게 처리할 수 있게 한다
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    //html 태그처럼 보내줄수있다
    res.write("<h1>Hello Node!</h1>");
    res.write("<p>Hello server</p>");
    res.end("<p>Hello hanju!</p>");
  })
  //서버를 프로세스에 올린다
  .listen(8080);

//server객체에서 listening이벤트가 발생했을때 실행될 콜백함수를 등록한다
server.on("listening", () => {
  console.log("8080번 포트에서 서버 대기 중입니다.");
});
server.on("error", (error) => {
  console.error(error);
});
