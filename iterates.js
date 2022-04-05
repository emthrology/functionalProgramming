const products= [
  {name: '반팔티', price: 15000},
  {name: '긴팔티', price: 20000},
  {name: '핸트폰케이스', price: 15000},
  {name: '후드티', price: 30000},
  {name: '바지', price: 25000},
]
//------------------map-------------------------
const map = (f,iter) => {
  let res = [];
  for(const p of iter) {
    res.push(f(p));// res 에 넣을 항목 f 에게 위임
  }
  return res;
}
console.log(map(p => p.name, products));
//map을 만들어 쓰는 이유 ? array를 상속받지 않은(native map()이 없는)유사배열객체, 이터러블 객체에 붙여쓰기 위함

//e.g.
let m = new Map();
m.set('a',10);
m.set('b',20);
m.set('c',30);
console.log(map(([k,v]) => [k,v * v],m));
console.clear()
//----------------------filter-------------------------
const filter = (f,iter) => {
  let res = [];
  for(const p of iter) {
    if(f(p)) res.push(p);
  }
  return res;
}

console.log(filter(p => p.price < 20000, products));
console.clear();
//---------------------reduce--------------------------
const nums = [1,2,3,4,5];
const reduce = (f, acc, iter) => {
  //js reduce 초기값 생략 옵션
  if(!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  // console.log({acc})
  for(const p of iter) {
    acc = f(acc, p);
  }
  return acc;
}

console.log(reduce((a, b) => a + b, 0, nums));
console.log(reduce((a, b) => a + b, nums));

//e.g.
//이 경우 초기값 생략하면 고장남 (로그 찍어놨으니까 살려서 돌려보면 무슨말인지 안다)
console.log(reduce((acc, cur) => acc + cur.price,0, products));

console.clear()
//--------------------- 섞어쓰기
console.log(
  reduce((acc, cur) => acc + cur,
    map(p => p.price,
      filter(p => p.price < 20000, products)
    )
  )
);

console.clear();
//---------------go-------------------
//reduce를 사용하여 다음 함수에 결과값 대입 (f(g(h(...(x)))) 꼴
const go = (...args) => reduce((acc,cur) => cur(acc), args);

go(
  0,
  a => a + 1,
  a => a + 10,
  a => a + 100,
  console.log
);

console.clear();
//-------------pipe-----------------
//합성함수 만들기 (합성된 '함수'를 리턴하는 함수) (f(g(h(...(x)))) 대신 F = ...hogof 로 선언하는 꼴
const pipe = (...args) => (acc) => go(acc,...args);
const f = pipe(
  a => a + 1,
  a => a + 10,
  a => a + 100,
);
console.log(f(100));

//첫번째 인자의 함수를 따로 다루는 버전
//첫번째로 전해지는 함수의 매개변수가 한 개 이상인 경우
//js 스팩 상 파라미터 여러개를 단축 표현할 때 스프레드를 사용한다
const pipeExtend = (f,...args) => (...arg) => go(f(...arg), ...args);
const e = pipeExtend(
  (a,b) => a*b,
  a => a+10,
  a => a+100
)
console.log(e(3,8))

console.clear();
//-----------------------리팩토링--------------
/*
reduce((acc, cur) => acc + cur,
  map(p => p.price,
    filter(p => p.price < 20000, products)
  )
)
 */
go(
  products,
  products => filter(p => p.price <20000, products),
  products => map(p => p.price,products),
  prices => reduce((acc,cur) => acc + cur, prices),
  console.log
)
console.clear();
//-----------------------curry---------------
//함수를 값으로 다루면서 받아둔 함수를 원하는 때 평가시키는 함수
const curry = f => (a,..._) => _.length? f(a, ..._) : (..._) => f(a, ..._);
const multi = curry((a,b) => a * b);
console.log(multi(3)); //(3,b) => 3 * b
console.log(multi(3)(2)) //6
const multi5 = multi(5); //(5,b) => 5 * b
console.log(multi5(3))//15

//---------------리펙토링--------------------
const curryMap = curry((f, iter) => {
  let res = [];
  for (const p of iter) {
    res.push(f(p));// res 에 넣을 항목 f 에게 위임
  }
  return res;
});
const curryFilter = curry((f, iter) => {
  let res = [];
  for (const p of iter) {
    if (f(p)) res.push(p);
  }
  return res;
});
const curryReduce = curry((f, acc, iter) => {
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
/*
go(
  products,
  products => filter(p => p.price <20000, products),
  products => map(p => p.price,products),
  prices => reduce((acc,cur) => acc + cur, prices),
  console.log
)
 */
go(
  products,
  products => curryFilter(p => p.price <20000)(products),
  products => curryMap(p => p.price)(products),
  prices => curryReduce((acc,cur) => acc + cur)(prices),
  console.log
);
//커리는 다음 파라미터를 받기를 대기하는 상태로 만들어두는게 목적이므로 product 생략 가능
go(
  products,
  curryFilter(p => p.price <20000),
  curryMap(p => p.price),
  curryReduce((acc,cur) => acc + cur),
  console.log
);

//----------------코드의 중복구간 모듈화-----------------
const total_price = pipe(
  curryMap(p => p.price),
  curryReduce((acc,cur) => acc + cur)
)
const base_total_price = predi => pipe(
  curryFilter(predi),
  total_price
)
go(
  products,
  // curryFilter(p => p.price < 20000),
  // // curryMap(p => p.price),
  // // curryReduce((acc,cur) => acc + cur)
  // total_price,
  base_total_price(p => p.price < 20000 ),
  console.log
);
go(
  products,
  // curryFilter(p => p.price >= 20000),
  // // curryMap(p => p.price),
  // // curryReduce((acc,cur) => acc + cur)
  // total_price,
  base_total_price(p=> p.price >= 20000 ),
  console.log
);

