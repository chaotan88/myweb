import Vue from 'vue'

/**
 * element table 滚动到底部加载更多
 */
Vue.directive('elmore', {
  bind (el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', () => {
      let sign = 100
      const scrollDistance = selectWrap.scrollHeight - selectWrap.scrollTop - selectWrap.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
})

/**
 * 价格自动补全
 */
// const priceCompletion = (el, binding, vnode, callback) => {
//   let eleVal = el.value
//   if (parseFloat(eleVal) >= 0 && !isNaN(eleVal)) {
//     // 小数点后可以任意位数
//     eleVal = eleVal.toString()
//     if (eleVal.indexOf('.') === -1) {
//       eleVal += '.00'
//     } else {
//       let splitRight = eleVal.split('.')[1]
//       if (splitRight.length === 0) {
//         eleVal += '00'
//       } if (splitRight.length === 1) {
//         eleVal += '0'
//       }
//     }
//     vnode.data.model.callback(eleVal)

//     // 输入保留两位小数
//     // vnode.data.model.callback(parseFloat(eleVal).toFixed(2))

//     // 回调
//     if (callback) callback()
//   }
// }
// Vue.directive('auto-price', {
//   bind (el, binding, vnode) {
//     let element = el.getElementsByTagName('input')[0]
//     if (parseFloat(element.value) >= 0 && !isNaN(element.value)) {
//       priceCompletion(element, binding, vnode)
//     }
//     // 鼠标失去焦点自动补全
//     element.addEventListener('blur', () => {
//       priceCompletion(element, binding, vnode)
//     }, true)
//     element.addEventListener('change', () => {
//       if (element === document.activeElement) return false
//       priceCompletion(element, binding, vnode, () => {
//         // 回调操作，二次触发避免el-input校验冲突
//         element.focus()
//         element.blur()
//       })
//     }, false)
//   }
//   // componentUpdated (el, binding, vnode) {
//   //   let element = el.getElementsByTagName('input')[0]
//   //   if (element === document.activeElement) return false
//   //   priceCompletion(element, binding, vnode, () => {
//   //     console.log('componentUpdated: ', element.value)
//   //     // 回调操作，二次触发避免el-input校验冲突
//   //     element.focus()
//   //     element.blur()
//   //   })
//   // }
// })

Vue.directive('auto-price', {
  bind (el, binding, vnode) {
    // console.log('el, binding, vnode: ', el, binding, vnode)
    let element = el.getElementsByTagName('input')[0]
    console.log('bind: ', element.value)
    let excute = () => {
      let eleVal = element.value
      if (parseFloat(eleVal) >= 0 && !isNaN(eleVal)) {
        eleVal = eleVal.toString()
        if (eleVal.indexOf('.') === -1) {
          eleVal += '.00'
        } else {
          let splitRight = eleVal.split('.')[1]
          if (splitRight.length === 0) {
            eleVal += '00'
          } if (splitRight.length === 1) {
            eleVal += '0'
          }
        }
        vnode.data.model.callback(eleVal)
      }
    }
    // if (!isNaN(element.value)) priceCompletion(el, binding, vnode, false)
    // // // 鼠标失去焦点自动补全
    element.addEventListener('blur', excute)
    excute()
    // element.addEventListener('focus', () => {
    //   console.log('focus: ', element.value)
    // }, true)
    // element.addEventListener('input', () => {
    //   console.log('input: ', element.value)
    // }, true)
    element.addEventListener('change', () => {
      element.focus()
      element.blur()
    }, true)
  },

  componentUpdated (el, binding, vnode) {
    let element = el.getElementsByTagName('input')[0]
    if (element === document.activeElement) return false
    let eleVal = vnode.data.model.value
    if (parseFloat(eleVal) >= 0 && !isNaN(eleVal)) {
      vnode.data.model.callback(parseFloat(eleVal).toFixed(2))
    }
  }
})
