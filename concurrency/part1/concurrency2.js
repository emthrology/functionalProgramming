//composition, monads
//함수합성 e.g. f(g(x)) 를 안전하게 하기 위해 모나드를 사용
//여기서는 '비동기성'을 안전하게 처리하기 위한 모나드로서 promise 를 다룸
//----------monad explained
const g = a => a + 1;
const f = a => a * a;

console.log(f(g(1))); // unsafe

console.log(f(g())); // unsafe

console.log([1].map(g).map(f)); //safe but only value is needed

Array.of(1).map(g).map(f).forEach(a => console.log(a, "array"));
Array.of().map(g).map(f).forEach(a => console.log(a, "array")); //빈값인 경우에 forEach 부분이 실행되지 않음

//in the case of Promise
Promise.resolve(1).then(g).then(f).then(r => console.log(r, "promise"));

new Promise(resolve =>
  setTimeout(() => resolve(2),100)
).then(g).then(f).then(r => console.log(r, "promise"));

