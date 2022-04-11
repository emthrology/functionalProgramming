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
const reduce = curry((f, acc, iter) => {
  //js reduce 초기값 생략 옵션
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  let cur;
  while(!(cur = iter.next()).done) {
    const a = cur.value;
    acc = f(acc, a);
  }
  // for (const p of iter) {
  //   acc = f(acc, p);
  // }
  return acc;
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
export {curry, go, pipe, range, map, filter, reduce, take,flatten, flatMap, L}