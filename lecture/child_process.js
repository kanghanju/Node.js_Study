//nodeprocess가 아닌 다른 process를 띄운다
const { exec } = require("child_process");

var process = exec("dir");

process.stdout.on("data", function (data) {
  console.log(data.toString());
});

process.stderr.on("data", function (data) {
  console.error(data.toString());
});

//cmd /c chcp 65001>nul && dir
