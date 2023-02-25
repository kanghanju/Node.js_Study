//구조할당분해
const { odd, even } = require("./var.js");

function checkOddOrEven(number) {
  if (number % 2) {
    return odd;
  } else {
    return even;
  }
}

//한가지만 모듈로 만들고 싶을때는 module.exports
module.exports = checkOddOrEven;
