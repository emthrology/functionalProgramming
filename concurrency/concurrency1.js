function add10(a,callback) {
  setTimeout(() => callback(a+10),100);
}

//callback hell
add10(10,res => {
  add10(res, res => {
    add10(res, res => {
      console.log(res)
    })
  })
})

function add20(a) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(a + 20),100))
}

add20(10) //30
  .then(add20) //50
  .then(add20) //70
  .then(console.log)