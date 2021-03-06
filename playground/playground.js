import {curry, go, pipe, map, range, filter, reduce, take,flatten,flatMap, L} from '../util/fx.js'

//즉시평가
// go(range(10),
//   map(n=>n + 10),
//   filter(n => n %2),
//   take(2),
//   console.log
// )

//지연평가
go(L.range(10),
  L.map(n=>n + 10),
  L.filter(n => n %2),
  take(2),
  console.log
)
console.clear();
//TODO 각 함수의 res,cur, push, 보조함수 등에 breakpoint 를 찍어서 확인해볼 것
//즉시평가방식은 각 라인에서 자신이 받은 인자(iterable)를 모두 실행시킨 결과를 다음 인자에 던져줌
//지연평가방식은 평가가 필요해진 시점에 인자를 inter.next() 단위로 하나씩 단계별로 평가함
//코드 진행의 방향성 면에서 설명하면 즉시평가는 주로 가로방향, 지연평가는 주로 세로방향으로 연산이 발생함
//시간복잡성을 측면에서는 매 라인마다 반복하는 즉시평가방식보다 지연평가방식이 유리한 측면이 있다고 봄


//--------2차원 배열 다루기
const arr = [
  [1,2],
  [3,4,5],
  [6,7,8],
  [9,10]
];
go(arr,
  L.flatten,
  L.filter(a => a % 2),
  take(3),
  console.log
)
//어느부분까지 평가를 지연할 지 결정할 수 있다.
//이 코드에서는 take 가 즉시평가형이므로 여기 도달하기 전까지는 평가가 지연된다