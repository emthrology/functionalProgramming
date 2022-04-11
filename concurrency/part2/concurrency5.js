import {curry, go, pipe, range, map, filter, reduce, take, find, flatten, flatMap, L} from '../../util/fx.js'

//fx.js 와 함께
go(
  [Promise.resolve(1),Promise.resolve(2),Promise.resolve(3)],
    L.map(a => Promise.resolve(a + 10)), //내부가 asyncGo로 구현되고있음 -> 던지는 인자 자체는 함수이므로 함수의 결과인 Promise<suspended> 가 리턴됨
    take(2), //어찌되었든 take 는 이제 프로미스를 받아 resolve 할 수 있으므로 resolve 된 결과 리턴함
    console.log
);
//이제 비동기 -> 동기, 동기 -> 비동기, 비동기 -> 동기 의 경우도 정상작동한다
//take(Infinity) 하면 즉시평가 map 함수와 동치이다. 이 경우도 정상작동한다.



const iter = L.map(a => Promise.resolve(a + 10))

const it = iter([Promise.resolve(10),Promise.resolve(20),Promise.resolve(30)])
let it2 = it[Symbol.iterator]();
it2.next().value.then(a => console.log(a));
it2.next().value.then(a => console.log(a));