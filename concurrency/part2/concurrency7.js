import {go, L, reduce, take} from "../../util/fx.js";

//지연평가 + Promise 의 효율성
go([1,2,3,4,5,6,7,8],
  L.map(a => {
    console.log(a);
    //비용이 큰 비동기 함수 가정
    return new Promise(resolve => setTimeout(() => resolve(a * a), 1000));
  }),
  L.filter(a => {
    console.log(a);
    return new Promise(resolve => setTimeout(() => resolve(a % 2), 1000));
  }),
  // reduce((a,b) => a + b)
  take(Infinity),
  console.log
);

//take(Infinity) : 즉시평가 방식 과 비교