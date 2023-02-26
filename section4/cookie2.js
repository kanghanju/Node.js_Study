const http = require("http");
const fs = require("fs").promises;
const url = require("url");
const qs = require("querystring");

//문자열은 JS에서 쓰기 불편해서 cookie를 객체로 바꿔주는 함수이다
const parseCookies = (cookie = "") =>
  cookie
    //문자.split(구분자)->배열
    .split(";")
    //배열.map(콜백함수), v는 array안에있는 item
    .map((v) => v.split("="))
    //return값을 받을 acc(누적값) 초기값은{},
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

http
  .createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie); // { mycookie: 'test' }
    // 주소가 /login으로 시작하는 경우
    if (req.url.startsWith("/login")) {
      const { query } = url.parse(req.url);
      const { name } = qs.parse(query);
      const expires = new Date();
      // 쿠키 유효 시간을 현재시간 + 5분으로 설정
      expires.setMinutes(expires.getMinutes() + 5);
      //리다이렉션 Location주소로 다시 돌려보내라!
      res.writeHead(302, {
        Location: "/",
        //한글을 encoding한것
        "Set-Cookie": `name=${encodeURIComponent(
          name
        )}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
      });
      res.end();
      // name이라는 쿠키가 있는 경우
    } else if (cookies.name) {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`${cookies.name}님 안녕하세요`);
      //쿠키가 없는 경우
    } else {
      try {
        const data = await fs.readFile("./cookie2.html");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(err.message);
      }
    }
  })
  .listen(8084, () => {
    console.log("8084번 포트에서 서버 대기 중입니다!");
  });
