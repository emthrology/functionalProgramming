const curry = f => (a,..._) => _.length? f(a, ..._) : (..._) => f(a, ..._);
const go = (...args) => reduce((acc,curFn) => curFn(acc), args);
const asyncGo = (a,f) => a instanceof Promise ? a.then(f) : f(a); //go의 첫번째 인자로 promise 가 들어와도 ok
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
acc는 recur 함수를 통해 resolved 되기 때문에, a 만 신경쓰면 된다

Promise.then의 두번째 인자 : reject 구현부
 */
const reduceF = (acc,a,f) =>
  a instanceof Promise ? a.then(a => f(acc,a), e => e === nop ? acc : Promise.reject(e)) : f(acc,a)

/**
 * @param iter
 * @returns head
 * iterable 을 받아서 비동기 처리 가능한 go를 활용하여
 * iter 에서 1개만 뽑은 후 h(ead)로 구조분해하여 리턴하는 함수
 */
const head = iter => asyncGo(take(1, iter), ([h]) => h);

/**
 * reduce: 비동기 처리 코드 추가
 * 유명함수를 사용하기 이전 코드에서는 프로미스 체인이 유지되면서
 * 이벤트 루프가 비동기 큐에 계속해서 머무르면서 성능저하가 일어나기 때문에
 * 유명함수를 사용하여 `비동기 처리가 필요한 시점`에서만 비동기 처리를 하는 것으로 이해를 했는데
 * 설명하신 의도와 맞는 방향일까요?? => Yes
 */
const reduce = curry((f, acc, iter) => {
  //js reduce 초기값 생략 옵션
  // if (!iter) {
  //   iter = acc[Symbol.iterator]();
  //   acc = iter.next().value;
  // } else {
  //   iter = iter[Symbol.iterator]();
  // }
  if(!iter) return reduce(f, head(iter = acc[Symbol.iterator]()),iter); //위의 명령형 코드를 재귀와 모듈화를 이용하여 간소화
  //일급시민으로서의 함수 : return function available
  return asyncGo(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = reduceF(acc, cur.value, f);
      if (acc instanceof Promise) return acc.then(recur); //비동기 코드를 분기 및 재귀처리 : 재귀하면서 비동기일때만 태스크 큐 추가
    }
    return acc
  });
});

//take: l에 다다를때까지 iter 반복
//take 할때 iter.next 가 비동기인 경우 resolve 하는 코드 추가
const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  return function recur() {
    let cur;
    while(!(cur = iter.next()).done) {
      const a = cur.value;
      if(a instanceof Promise) {
        return a //프로미스를 받기위한 return
          .then(a => (res.push(a), res).length === l ? res : recur())
          .catch(e => e === nop ? recur() : Promise.reject(e)); //Kleisli 합성 구분자(nop)와 일반적인 에러 구분
      }
      res.push(a)
      if (res.length === l) return res;
    }
    return res;
  }();
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
  for (const a of iter)
    // yield f(a);
    yield asyncGo(a,f);
});
const nop = Symbol('nop');
L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    //비동기적 상황 발생 고려
    const res = asyncGo(a,f);
    if(res instanceof Promise) yield res.then(res => res ? a : Promise.reject(nop));
    else if (res) yield a
  }
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