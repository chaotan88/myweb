const dateFns = require('date-fns')
const {global, domain} = require('../../config/utils')

module.exports = {
  /**
   * 判断是否同一模块，带出搜索记录
   * @param  {[type]}   urls     [路由模块]
   * @param  {[type]}   number   [匹配路由记录条数，非必填]
   * @param  {Function} callback [回调]
   */
  filterSearchData (urls, number, callback) {
    if (!urls) return false
    let resolve = null
    let isQuery = null
    // 第二个参数为函数时设置为回调
    if (typeof number === 'function') {
      resolve = number
      isQuery = 3
    } else {
      resolve = callback
      isQuery = number
    }
    let filterSameModule = false
    // 过滤路由模块单个或多个
    if (Array.isArray(urls)) {
      urls.forEach((row) => {
        if (this.filterSameModule(row)) filterSameModule = true
      })
    } else {
      filterSameModule = this.filterSameModule(urls)
    }
    if (filterSameModule || this.filterSamePage(isQuery)) {
      let getCondition = JSON.parse(localStorage.getItem(global.FORM_DATA))
      if (getCondition && resolve) resolve(getCondition)
    } else {
      localStorage.removeItem(global.FORM_DATA)
    }
  },

  /**
   * 判断是否相同页面
   */
  filterSamePage (number) {
    let historyRoute = JSON.parse(localStorage.getItem(global.HISTORY_ROUTE)) || []
    let res = false
    if (parseInt(number) === 2 && historyRoute[historyRoute.length - 1].path === historyRoute[historyRoute.length - 2].path) {
      res = true
    } else if (parseInt(number) === 3 && historyRoute[0].path === historyRoute[1].path && historyRoute[1].path === historyRoute[2].path) {
      res = true
    }
    return res
  },

  /**
   * 判断是否相同模块
   */
  filterSameModule (str) {
    let prevRoute = JSON.parse(localStorage.getItem(global.PREV_ROUTE)) || []
    let res = prevRoute.length === 2 && prevRoute[0].path.match(new RegExp(str, 'gi')) ? !!true : !!false
    return res
  },

  /**
   * 过滤图片显示
   */
  filterImgUrl (val) {
    if (!val) return ''
    let res = val.toString().match(/http/gi) ? val : domain.ROOT_IMG + val
    return res
  },

  /**
   * 深拷贝
   */
  deepCopy (o) {
    if (o instanceof Array) {
      let n = []
      for (let i = 0; i < o.length; ++i) {
        n[i] = this.deepCopy(o[i])
      }
      return n
    } else if (o instanceof Object) {
      let n = {}
      for (let i in o) {
        n[i] = this.deepCopy(o[i])
      }
      return n
    } else {
      return o
    }
  },

  /**
   * 自动补全小数点后两位
   */
  blurAutoCompletion (vm, obj) {
    if ((!obj || !vm[obj]) && parseInt(vm[obj]) !== 0) return ''
    let val = vm[obj].toString()
    if (isNaN(val)) return ''
    if (val.indexOf('.') === -1) {
      vm[obj] += '.00'
    } else {
      let splitRight = val.split('.')[1]
      if (splitRight.length === 0) {
        vm[obj] += '00'
      } if (splitRight.length === 1) {
        vm[obj] += '0'
      }
    }
  },

  /**
   * 时间过滤器
   */
  filterDate (value, type) {
    if (!value) return ''
    let filterType = type || 'YYYY-MM-DD HH:mm:ss'
    return dateFns.format(value, filterType)
  },

  /**
   * 补全结束时间，精确到23:59:59
   */
  completionEndDate (value) {
    if (!value) return ''
    let res = dateFns.format(new Date(value).getTime() + (24 * 60 * 60 * 1000 - 1), 'YYYY-MM-DD HH:mm:ss')
    return res
  },

  /**
   * 自动触发元素点击事件
   */
  triggerEvent (obj) {
    if (!obj) return ''
    if (document.all) {
      obj.click()
    } else {
      // 创建一个事件对象，就好像你绑定事件回调函数里获得的那个事件对象一样
      let myEvent = document.createEvent('Event')
      // 初始化这个事件对象，为它提高需要的“特性”
      myEvent.initEvent('click', true, true)
      // 按照常见的方式绑定对该事件的监听，这里的 element 可以是任何一个元素，你懂的
      obj.addEventListener('click', () => {})
      // 然后这样触发它
      obj.dispatchEvent(myEvent)
    }
  },

  /**
   * 获取当前月份多少天
   */
  getDaysInMonth (year, month) {
    month = parseInt(month, 10)  // parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
    var temp = new Date(year, month, 0)
    return temp.getDate()
  },

  /**
   * 滚动到指定位置
   */
  scrollToTop (domName, y) {
    let dom = domName
    // 判断传入参数className：是class还是一个dom对象
    if (typeof domName === 'string') {
      dom = document.getElementsByClassName(domName)[0]
    }
    // 默认滚动到顶部
    let height = y || 0
    // 判断参数y：是数值number还是对象object
    if (y instanceof Object) {
      height = y.offsetTop
    }
    // 获取当前滚动高度
    let top = dom.scrollTop
    // 设置每次滚动的距离
    let step = Math.floor(top / 4)
    let timer = setInterval(function () {
      top -= step
      if (top >= height) {
        dom.scrollTop = top
      } else {
        dom.scrollTop = height
        // 清除定时器
        clearInterval(timer)
      }
    }, 30)
  }
}
