const curry = f => (a,..._) => _.length? f(a, ..._) : (..._) => f(a, ..._);
const go = (...args) => reduce((acc,cur) => cur(acc), args);
const pipe = (...args) => (acc) => go(acc,...args);
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
  iter = iter[Symbol.iterator]();
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
export {curry, go, pipe, range, map, filter, reduce, take, L}