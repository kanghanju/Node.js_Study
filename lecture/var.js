const odd = "홀수입니다";
const even = "짝수입니다";

module.exports = {
  //객체를 module.exports에 대입
  odd, //최신문법에서 key와 value가 같으면 아래와 같이 생략 가능
  even,
};

//두 가지 이상을 exports하고 싶을 경우에는
//exports.odd = odd;
//exports.even = even;

//exports와 module.exports는 같이 쓸 수 없다!!!
