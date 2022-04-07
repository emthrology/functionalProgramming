const fibonaccis = (limit) => {
  const arr = [1,1];
  while(arr[0] + arr[1] <= limit) arr.unshift(arr[0] + arr[1]);
  arr.reverse()
  return arr;
}

const test = fibonaccis(1346269)
console.log(test)
