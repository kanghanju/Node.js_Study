const http = require("http");

http
  .createServer((req, res) => {
    //클라이언트가 요청함, 자동으로 favicon.ico요청도 보낸다
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, { "Set-Cookie": "mycookie=test" });
    //응답의 body
    res.end("Hello cookie!");
  })
  .listen(8083, () => {
    console.log("8083번 포트에서 서버 대기 중입니다");
  });
