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
const priceCompletion = (el, binding, vnode, isUpdate) => {
  let element = el.getElementsByTagName('input')[0]
  let eleVal = isUpdate ? vnode.data.model.value : element.value
  if (parseInt(eleVal) >= 0 && !isNaN(eleVal)) {
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
Vue.directive('auto-price', {
  bind (el, binding, vnode) {
    let element = el.getElementsByTagName('input')[0]
    let count = 0
    let isInit = true
    // console.log('isInit11111: ', isInit)
    let execute = () => {
      count++
      let eleVal = isInit ? vnode.data.model.value : element.value
      // console.log('取值 ', eleVal)
      isInit = false
      if (parseInt(eleVal) >= 0 && !isNaN(eleVal)) {
        eleVal = eleVal.toString()
        if (eleVal.indexOf('.') === -1) {
          // console.log('取值1 ', eleVal)
          eleVal += '.00'
        } else {
          let splitRight = eleVal.split('.')[1]
          if (splitRight.length === 0) {
            // console.log('取值2 ', eleVal)
            eleVal += '00'
          } if (splitRight.length === 1) {
            eleVal += '0'
          }
        }
        vnode.data.model.callback(eleVal)
      }
      // 二次触发避免el-input校验冲突
      if (count < 3) {
        element.focus()
        setTimeout(() => {
          element.blur()
          count = 1
        }, 0)
      }
    }
    // 初始化自动补全
    execute()
    // 鼠标失去焦点自动补全
    element.addEventListener('blur', () => {
      el.setAttribute('isFocus', false)
      priceCompletion(el, binding, vnode, false)
    })
    element.addEventListener('focus', () => {
      el.setAttribute('isFocus', true)
    })
  },
  componentUpdated (el, binding, vnode) {
    if (el.getAttribute('isFocus') === 'true') return false
    priceCompletion(el, binding, vnode, true)
    if (el.getAttribute('isInit')) return false
    setTimeout(() => {
      el.setAttribute('isInit', true)
    }, 100)
    let eleVal = vnode.data.model.value
    if (parseInt(eleVal) >= 0 && !isNaN(eleVal)) {
      eleVal = eleVal.toString()
      if (eleVal.indexOf('.') === -1) {
        // attrs.isfirest dom 自定义
        if (!vnode.data.attrs.isfirest && vnode.data.model.expression === 'formData.reductionAmountRule') {
          console.log('不是第一次加载过滤掉')
        } else {
          eleVal += '.00'
        }
      } else {
        let splitRight = eleVal.split('.')[1]
        if (splitRight.length === 0) {
          console.log('取值4 ', eleVal)
          eleVal += '00'
        } if (splitRight.length === 1) {
          eleVal += '0'
        }
      }
      vnode.data.model.callback(eleVal)
    }
  }
})
