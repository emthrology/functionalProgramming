import {curry, go, pipe, range, map, filter, reduce, take, find, flatten, flatMap, L} from '../../util/fx.js'

//Kleisli composition - L.filter, filter, nop, take
const a = go([1,2,3,4,5,6],
  L.map(a => Promise.resolve(a * a)),
  L.filter(a => {
    console.log(a);
    // return a % 2
    return Promise.resolve(a % 2);
  }),
  L.map(a => {
    console.log(a);
    return a * a
  }),
  L.map(a => {
    console.log(a);
    return a * a
  }),
  take(3),
);

//reduce에서 nop 지원
const b = go([1,2,3,4,5],
  L.map(a => Promise.resolve(a * a)),
  L.filter(a => Promise.resolve(a % 2)),
  reduce((a,b) => a + b)
);

Promise.resolve(a).then(res => {
  console.log(res);
  console.log('----------Kleisli composition - L.filter, filter, nop, take')
})
.then(() =>
  Promise.resolve(b).then(res => {
    console.log(res);
    console.log('----------reduce에서 nop 지원');
  })
)
