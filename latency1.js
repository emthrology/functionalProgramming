import {curry, go, pipe, range, map, filter, reduce, take, L} from './fx.js'

const add = (a,b) => a + b;
//---------------range----------------
//expects: range(2) => [1,2], range(5) => [1,2,3,4,5]
// const range = l => {
//   let i = -1;
//   let res = [];
//   while (++i < l) {
//     // console.log(i,'range')
//     res.push(i)
//   }
//   return res;
// };

let list = range(4);
console.log({list})
console.log(reduce(add, list));

//----------------lazy range


let list2 = L.range(4);
console.log({list2})
console.log(reduce(add, list2));

/*
일반적인 배열이 즉시 평가-생성되는데 반해
L.range 는 즉시 생성되지 않는다.
reduce 등 L.range 함수를 통해 생성하는 값이 필요해지는 순간 평가된다.
 */

//---------test
function test(name,time,f) {
  console.time(name)
  while(time--) {f()}
  console.timeEnd(name)
}

test('range',10, () => reduce(add,range(1000000)))
test('L.range',10, () => reduce(add,L.range(1000000)))
// L.range 가 보통 연산속도가 더 빠름

console.clear();
//--------------------take-------------------------
//l 까지만 잘라서 리턴하는 함수
// const take = curry((l, iter) => {
//   let res = [];
//   for (const a of iter) {
//     res.push(a);
//     if (res.length === l) return res;
//   }
//   return res;
// });
console.time('');
go(
  range(1000000),
  take(5),
  console.log
)
console.timeEnd('');
console.time('');
go(
  L.range(1000000),
  take(5),
  console.log
)
console.timeEnd('');
/*
위는 백만개 다 만들고 5개 자르는 코드
아래는 다 안만들고 5개까지만 iter.next() 되는 코드
 */
