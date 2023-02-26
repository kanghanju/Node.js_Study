const http = require("http");
const fs = require("fs").promises;

const server = http
  .createServer(async (req, res) => {
    //async/awit할 때는 error를 캐치할 방법이 없어서 try/catch로 감싼다
    try {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      //server2.fs로 html파일을 읽는다
      const data = await fs.readFile("./server2.html");
      res.end(data);
    } catch (error) {
      console.error(error);
      //일반 문자열 plain임을 알려준다
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(error.message);
    }
  })
  .listen(8080);

server.on("listening", () => {
  console.log("8080번 포트에서 서버 대기 중입니다");
});
server.on("error", (error) => {
  console.error(error);
});
