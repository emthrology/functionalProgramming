import { curry, go, pipe, map, range, filter, reduce, take, L } from '../util/fx.js'

//-------------L.flatten
const isIterable = a => a && a[Symbol.iterator];
//리펙토링 : yield *iterable == for(const val of iterable) yield val;
L.flatten = function *(iter) {
  for(const a of iter) {
    // if(isIterable(a)) for (const b of a) yield b;
    if(isIterable(a)) yield *a;
    else yield a;
  }
};
//deep flatt : 함수명을 선언하여 재귀호출 가능하게 (기명함수화)
L.deepFlat = function *f(iter) {
  for(const a of iter) {
    if(isIterable(a)) yield *f(a);
    else yield a;
  }
}
//제너레이터는 이터레이터를 반환한다
let it = L.flatten([[1,2],3,4,[5,6],[7,8,9]])
console.log('it : ',[...it])

//즉시반환형 flatter
const flatten = pipe(L.flatten,take(Infinity));

//-----------------flatMap : mapping 과 flatting 을 한꺼번에

//Array.prototype.flatMap() : nested array 전용, root array 에 type 이 array 가 아닌 값이 오면 제대로 작동안할수있음
console.log('Array.prototype.flatMap(): ',[[1, 2], [3, 4], [5, 6, 7], [10]].flatMap(a => a.map(a => a * a)));
// [[1, 2], [3, 4], [5, 6, 7],8,9 [10]].flatMap(a => a.map(a => a * a)); //TypeError: a.map is not a function ( for primitive number)

//..is equivalent to...
flatten([[1, 2], [3, 4], [5, 6, 7], [10]].map(a => a.map(a => a * a)));

//지연평가형 L.flatMap
L.flatMap = curry(pipe(L.map, L.flatten)); //맨 아래에 있는게 제너레이터이므로, 이터레이터를 반환한다

// let it2 = L.flatMap(map(a => a*a), [[1, 2], [3, 4], [5, 6, 7], [10]]);
let it2 = L.flatMap(a => a, [[1, 2], [3, 4], [5, 6, 7], [10]]);
console.log([...it2])

//즉시평가형 flatMap
const flatMap = curry(pipe(L.flatMap, take(Infinity)));

//사용 예
console.log(flatMap(L.range,[1,2,3]))
//range : 0 부터 입력한 숫자까지 나열하여 리턴
//[0],[0,1],[0,1,2]