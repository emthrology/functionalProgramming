import {curry, go, pipe, range, map, filter, reduce, take, find, flatten, flatMap, L} from '../../util/fx.js'

//go,pipe,reduce 에서의 비동기 제어
//reduce 는 fx.js 에서 확인
//
go(Promise.resolve(1), //초기값에 프로미스 들어오는 문제 => fx.js 에서 해결
  a => a + 10,
  a => Promise.resolve(a + 100),
  a => Promise.reject('error'),
  a => a + 1000,
  a => a + 10000,
  console.log
).catch(a => console.log(a))


const val = pipe(
  a => a + 10,
  a => a + 100,
  a => Promise.resolve(a + 1000),
  // a => Promise.reject('error'),
  a => a + 10000,
);
// console.log(val(Promise.resolve(1)));
val(2).then(console.log).catch(a => console.log(a));


//------promise.then 의 중요한 규칙
//프로미스 체인으로 엮여 있더라도 하나의 then 으로 처리 가능하다
Promise.resolve(Promise.resolve(Promise.resolve(1))).then(console.log)
new Promise(resolve => resolve(new Promise(resolve => resolve(1)))).then(console.log)