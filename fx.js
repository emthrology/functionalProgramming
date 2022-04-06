const curry = f => (a,..._) => _.length? f(a, ..._) : (..._) => f(a, ..._);
const go = (...args) => reduce((acc,cur) => cur(acc), args);
const pipe = (...args) => (acc) => go(acc,...args);
const map = curry((f, iter) => {
  let res = [];
  for (const p of iter) {
    res.push(f(p));// res 에 넣을 항목 f 에게 위임
  }
  return res;
});
const filter = curry((f, iter) => {
  let res = [];
  for (const p of iter) {
    if (f(p)) res.push(p);
  }
  return res;
});
const reduce = curry((f, acc, iter) => {
  //js reduce 초기값 생략 옵션
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const p of iter) {
    acc = f(acc, p);
  }
  return acc;
});
