function add10(a,callback) {
  setTimeout(() => callback(a+10),100);
}

//callback hell
// var a = add10(10,res => {
//   add10(res, res => {
//     add10(res, res => {
//       console.log(res)
//     })
//   })
// })
// console.log({a}) //undefined

//promise : 비동기상황에 대한 값을 만들어서 return (중요)
// => 비동기 상황이 '일급'으로 다뤄지고 있음
function add20(a) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(a + 20),100))
}

var b = add20(10) //30
  .then(add20) //50
  .then(add20) //70
  // .then(console.log)
// console.log({b}) //Promise

//--------일급으로 다루는 비동기상황의 활용
const delay100 = a => new Promise(resolve => setTimeout(() => resolve(a),100));
const go1 = (a, f) => f(a);
const add5 = a => a+5;
console.log(go1(Promise.resolve(10),add5)); //[object Promise]5
console.log(go1(delay100(10),add5)); //[object Promise]5

const go2 = (a,f) => a instanceof Promise ? a.then(f): f(a);
var r1 = go2(10,add5)
var r2 = go2(delay100(10),add5)
console.log(r1); //15
r2.then(console.log) //15

//go 함수를 이용하여 이렇게 표현 가능
go2(go2(10,add5), console.log); //15
go2(go2(delay100(10),add5), console.log); //15
//10, deley100(10) 을 변수화하면 두 코드는 완전히 같은 구조가 됨
var n1 = 10;
var n2 = delay100(10);
console.log(go2(go2(n1, add5), console.log)); //undefined
console.log(go2(go2(n2, add5), console.log)); //promise 확인
