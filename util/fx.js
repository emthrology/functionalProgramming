const curry = f => (a,..._) => _.length? f(a, ..._) : (..._) => f(a, ..._);
const go = (...args) => reduce((acc,curFn) => curFn(acc), args);
const pipe = (f,...fs) => (...as) => go(f(...as), ...fs);
const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    // console.log(i,'range')
    res.push(i)
  }
  return res;
};
const map = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while(!(cur = iter.next()).done) {
    const p = cur.value;
    res.push(f(p))
  }
  // for (const p of iter) {
  //   res.push(f(p));// res 에 넣을 항목 f 에게 위임
  // }
  return res;
});
const filter = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while(!(cur = iter.next()).done) {
    const p = cur.value;
    if (f(p)) res.push(p);
  }
  // for (const p of iter) {
  //   if (f(p)) res.push(p);
  // }
  return res;
});

/*
reduce: 비동기 처리 코드 추가
유명함수를 사용하기 이전 코드에서는 프로미스 체인이 유지되면서
이벤트 루프가 비동기 큐에 계속해서 머무르면서 성능저하가 일어나기 때문에
유명함수를 사용하여 `비동기 처리가 필요한 시점`에서만 비동기 처리를 하는 것으로 이해를 했는데
설명하신 의도와 맞는 방향일까요?? => Yes
*/
const go1 = (a,f) => a instanceof Promise ? a.then(f) : f(a); //go의 첫번째 인자로 promise 가 들어와도 ok
const reduce = curry((f, acc, iter) => {
  //js reduce 초기값 생략 옵션
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  //일급시민으로서의 함수 : return function available
  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      acc = f(acc, a);
      if (acc instanceof Promise) return acc.then(recur); //비동기 코드를 분기 및 재귀처리 : 재귀하면서 비동기일때만 태스크 큐 추가
    }
    return acc
  });
});
const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while(!(cur = iter.next()).done) {
    const a = cur.value;
    res.push(a)
    if (res.length === l) return res;
  }
  // for (const a of iter) {
  //   res.push(a);
  //   if (res.length === l) return res;
  // }
  return res;
});
const find = curry((f, iter) => go(
  iter,
  L.filter(f), //평가 보류
  take(1), //invoke evaluation : 지연평가부분의 iter.next() 발동
  ([a]) => a
));
const L = {};
L.range = function* (l) {
  let i = -1;
  while (++i < l) {
    // console.log(i,'L.lange')
    yield i;
  }
};
L.map = curry(function* (f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while(!(cur = iter.next()).done) {
    const p = cur.value;
    yield f(p);
  }
  // for (const a of iter) yield f(a);
});
L.filter = curry(function* (f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while(!(cur = iter.next()).done) {
    const a = cur.value;
    if (f(a)) yield a
  }
  // for (const a of iter) {
  //   if (f(a)) yield a
  // }
});
const isIterable = a => a && a[Symbol.iterator];
L.flatten = function *(iter) {
  for(const a of iter) {
    // if(isIterable(a)) for (const b of a) yield b;
    if(isIterable(a)) yield *a;
    else yield a;
  }
};
//즉시반환형 flatter
const flatten = pipe(L.flatten,take(Infinity));
//지연평가형 L.flatMap
L.flatMap = curry(pipe(L.map, L.flatten));
//즉시평가형 flatMap
const flatMap = curry(pipe(L.flatMap, take(Infinity)));
export {curry, go, pipe, range, map, filter, reduce, take, find, flatten, flatMap, L}