const http = require("http");
const fs = require("fs").promises;

const users = {}; // 데이터 저장용

http
  .createServer(async (req, res) => {
    try {
      //GET 요청(주소요청)
      if (req.method === "GET") {
        //localhost:8082뒤에 /가 있음
        if (req.url === "/") {
          const data = await fs.readFile("./restFront.html");
          //성공적으로 응답했다(200),클라이언트 너가 받을 데이터는 html이야~(header에 넣어주는 것!!)
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(data);
        } else if (req.url === "/about") {
          const data = await fs.readFile("./about.html");
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(data);
        } else if (req.url === "/users") {
          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
          });
          //Object to JSON
          return res.end(JSON.stringify(users));
        }
        //html안에 css와 js를 가져온다(html도 css와 js를 서버에  GET요청함)
        // 주소가 /도 /about도 /users도 아니면
        try {
          const data = await fs.readFile(`.${req.url}`);
          return res.end(data);
        } catch (err) {
          // 주소에 해당하는 라우트를 못 찾았다는 404 Not Found error 발생
        }
      } else if (req.method === "POST") {
        if (req.url === "/user") {
          let body = "";
          // 요청의 body를 stream 형식으로 받음
          req.on("data", (data) => {
            body += data;
          });
          // 요청의 body를 다 받은 후 실행됨
          return req.on("end", () => {
            console.log("POST 본문(Body):", body);
            //json형식으로 parse한다 (JSON문자열의 구문을 분석해 결과로 JS값이나 객체 생성)
            const { name } = JSON.parse(body);
            const id = Date.now();
            users[id] = name;
            //201: 생성됨
            res.writeHead(201, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("ok");
          });
        }
      } else if (req.method === "PUT") {
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2];
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          return req.on("end", () => {
            console.log("PUT 본문(Body):", body);
            users[key] = JSON.parse(body).name;
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            return res.end("ok");
          });
        }
      } else if (req.method === "DELETE") {
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2];
          delete users[key];
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("ok");
        }
      }
      res.writeHead(404);
      return res.end("NOT FOUND");
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(err.message);
    }
  })
  .listen(8082, () => {
    console.log("8082번 포트에서 서버 대기 중입니다");
  });
