import{find} from '../../util/fx.js'
//------------Kleisli composition
//오류가 있을 수 있는 상황에서의 함수 합성
const users = [
  {id: 1, name :'aa'},
  {id: 2, name :'bb'},
  {id: 3, name :'cc'},
  {id: 4, name :'dd'},
]
const getUserById = id =>
  find(u => u.id === id, users);

const f =({name}) => name;
const g = getUserById;

//오류에 취약한 합성
// const fg = id => f(g(users, id))
//
// const r = fg(2);
// console.log(r)
// users.pop();
// users.pop();
// users.pop(); //비즈니스 로직 상 일어날 수 있는 상황 연출
// console.log(fg(2)) //error

//오류에 대비한 합성  (g 함수에 reject 추가)
const getUserById2 = id =>
  find(u => u.id === id, users) || Promise.reject('없음');
const g2 = getUserById2
users.pop();
users.pop();
users.pop(); //비즈니스 로직 상 일어날 수 있는 상황 연출
const fg = id => Promise.resolve(id).then(g2).then(f).catch(a => a);

fg(2).then(console.log);