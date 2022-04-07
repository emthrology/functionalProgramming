import {curry, go, pipe, map, range, filter, reduce, take, L} from '../util/fx.js'

/*
이터러블 중심 프로그래밍에서의 지연 평가 (Lazy Evaluation)
synonyms:
-제때 계산법
-느긋한 계산법
-제너레이터/이터레이터 프로토콜 기반 구현
 */

//---------L.map : 보조함수를 지정해놓고 필요한 만큼만 가져올 수 있는?
// L.map = function *(f,iter) {
//   for(const a of iter) yield f(a);
// }
const arr = [1,2,3,4,5];
const it = L.map(a => a*2, arr);
// console.log(it.next())
// console.log(it.next())
// console.log(it.next())
// console.log(it.next())
console.log([...it])

//---------L.filter
// L.filter = function *(f,iter) {
//   for(const a of iter) {
//     if(f(a)) yield a
//   }
// }

const it2 = L.filter(a => a % 2 !== 0, arr);
console.log([...it2])

/*
map,filter 계열 함수들이 가지는 결합 법칙
- 사용하는 데이터에 상관없이
- 사용하는 보조 함수가 순수함수이기만 하면
- 아래와 같이 결합하는 경우 둘 다 결과가 같음

[[mapping, mapping],[filtering, filtering],[mapping,mapping]] //즉시평가방식
=
[[mapping, filtering, mapping],[mapping, filtering, mapping]] //지연평가방식
 */

console.clear();
//----------------결과를 만드는 함수 reduce, take
//Object.entries 지연평가화
L.entries = function *(obj) {
  for(const k in obj) yield [k, obj[k]];
}
//Array.prototype.join() 을 더 쓰기 쉽게
const join = curry((sep = ',', iter) => reduce((acc, cur) => `${acc}${sep}${cur}`, iter));
const queryStr = pipe(
  // Object.entries,
  L.entries,
  L.map(([k,v]) => `${k}=${v}`),
  // reduce((acc,cur) => `${acc}&${cur}`)
  join('&'),
)
//위 코드의 지연평가화 리펙토링 과정

console.log(queryStr({
  limit: 10,
  offset: 10,
  type: 'notice'
}));

function *a() {
  yield 11;
  yield 12;
  yield 13;
  yield 14;
}

console.log('----------------')
console.log(a)
console.log(a())
console.log(a().next())
go(
  a(),
  join(' - '),
  console.log
)


console.clear();
//------------------take,find
const users = [
  {age: 32},
  {age: 31},
  {age: 26},
  {age: 28},
  {age: 31},
  {age: 32},
  {age: 37},
  {age: 25}
];
//즉시평가방식
// const find = f => pipe (
//   filter(f), //여기서 전부 순회하고있음
//   take(1), //여기서도 두 개 객체가 리턴되고 있음
//   ([a]) => a
// );
//지연평가방식
const find = curry((f, iter) => go(
  iter,
  L.filter(f), //평가 보류
  take(1), //invoke evaluation : 지연평가부분의 iter.next() 발동
  ([a]) => a
));
const findUnder30 = find(u => u.age < 30);
console.log(findUnder30(users));

//----------L.map을 활용한 map 리팩토링
// const map = curry((f, iter) => {
//   let res = [];
//   iter = iter[Symbol.iterator]();
//   let cur;
//   while (!(cur = iter.next()).done) {
//     const p = cur.value;
//     res.push(f(p))
//   }
//   return res;
// });
const mapRepectored = curry(
  //1단계: (f,iter) => go (
  // iter,
  // L.map(f),
  // take(Infinity)
  //));

  //2단계: L.map(f,iter) //L.map 도 커링되어있기 때문에 따로 받든 같이 받든 상관없다

  //3단계: (f,iter) 를 받아서 L.map 에 그대로 (f,iter)를 던지기 때문에 pipe 로 줄일 수 있다
  pipe(
  L.map,
  take(Infinity)
))
//마찬가지로 filter 도 L.filter 로 리팩토링 가능
const filterRepectored = curry (
  pipe(L.filter, take(Infinity))
)