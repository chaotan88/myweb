// // -----模块A-------//
// var name = "kitty"
// var age = 15
// var say = [1,2,3,4,5];
//   say.forEach((value,index) => {
//       // console.log('say: ', say)
//   })
// // let say = [2]
// // for (let i in say) {
// //   console.log('say: ', say)
// // }

// let a = [1,2,3,4]

// for (let value of a){
//   // console.log('value: ', value)
//   if (value === 3) {
//     break
//   }
//   // console.log('a: ', a)
// }


// let prx = {'RMB': 1000, 'doller': 0}

// let banker = new Proxy(prx, {
//   get: (target, property) => {
//     if(target[property] > 0){
//       return target[property]
//     }else{
//       return '余额不足'
//     }
//   },

//   set: (target, property) => {
//     if(!Number.isInteger(value)){
//       return '请输入正确是数值'
//     }
//     target[property] = value
//   }
// })

// let m = new Map([
//   ['name', 'xia'],
//   ['age', 18]
// ])

// m.forEach((value, key) => {
//   console.log('m: ', value)
// })
// console.log('m: ', m.get('name'))
// export {name,age,say,a}