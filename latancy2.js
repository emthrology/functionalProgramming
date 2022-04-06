import {curry, go, pipe, map, range, filter, reduce, take, L} from './fx.js'

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