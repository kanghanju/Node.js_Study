console.log(this); //전역 scope의 this는 빈객체{}
console.log(this === module.exports);

function a() {
  console.log(this); //function안에 들어있는 this는 global
  console.log(this === global);
}

a();
