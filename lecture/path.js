const path = require("path");

//경로처리할때 쓰인다

//join은 절대경로를 무시한다
console.log(path.join(__dirname, "..", "/var.js"));
//resolve는 절대경로가 있으면 앞에 두 매개변수를 무시한다
console.log(path.resolve(__dirname, "..", "/var.js"));
