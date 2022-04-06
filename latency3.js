import {curry, go, pipe, map, range, filter, reduce, take, L} from './fx.js'

//---------L.flatten
const isIterable = a => a && a[Symbol.iterator];
L.flatten = function *(iter) {
  for(const a of iter) {
    if(a.hasOwnProperty(Symbol.iterator)) for(const b of a) L.flatten(b);
    else yield a
  }
}

let it = L.flatten([[1,2],3,4,[5,6],7,8,9])
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())