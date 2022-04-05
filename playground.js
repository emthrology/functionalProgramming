
//generator : 이터레이터 / 이터러블을 리턴하는 함수
function *gen() {
  yield 1;
  if(false) yield 2; //순회할 값을 선언 or 명령 가능
  yield 3;
  return 100; //done:true , 순회할 때는 반환되지 않음
}

let iter = gen();
//
// console.log(iter.next())
// console.log(iter.next())
// console.log(iter.next())
// console.log(iter.next())
// console.log(iter[Symbol.iterator]() === iter)
//
// for(const a of gen()) console.log(a)

//i+1 한 숫자를 생산하는 제너레이터
function *infinity(i = 0) {
  while(true) yield i++;
}
//l 까지 iter 를 반복하는 제너레이터 (제너레이터도 이터레이터)
function *limit(l,iter) {
  for(const a of iter) {
    yield a;
    if(a === l) return;
  }
}
function *odds(l) {
  for(const a of limit(l,infinity(1))) {
    if(a % 2) yield a;
  }
}

for(const a of odds(40)) {
  console.log(a)
}

//스프레드, 구조분해에서의 제너레이터
console.log(...odds(100)) //[1,3,...,97,99]

const [head,...rest] = odds(5);
console.log(head) //1
console.log(rest) //[3,5]
