import dateFns from 'date-fns'
const emptyTips = '--'
// 操作系统
let appOsStatus = (v) => {
  switch (v) {
    case 1:
      return 'windows'
    case 2:
      return 'android'
  }
}

// 6.支付方式
let payTypeStatus = v => {
  if (v >= 0) {
    let statusArr = ['微信支付', '支付宝支付', '线下支付']
    return statusArr[v - 1]
  }
}

// 10.支付状态
let payStatus = v => {
  if (v >= 0) {
    let statusArr = ['未支付', '已支付 ']
    return statusArr[v - 1]
  }
}

// 时间戳-日期时间  dateFilter('YYYY-MM-DD HH:mm:ss')
let dateFilter = (v, type = 'MM-DD-YYYY h:mm:ss A') => {
  // if (v, type) {
  if (!v) return false
  return dateFns.format(v, type)
  // }
}
// 过滤属性
let selectFilter = (value) => {
  if (!value) return ''
  value = value.toString()
  var selectData = JSON.parse(localStorage.getItem('ProSelection'))
  if (!selectData) return
  let result = ''
  if (value.indexOf(',') !== -1) {
    let splitValueArr = value.split(',')
    splitValueArr.filter((item) => {
      result += selectData.filter((row) => row.id.toString() === item.toString())[0].name + ' '
    })
    return result
  } else {
    if (selectData.filter((row) => row.id.toString() === value)[0]) {
      return selectData.filter((row) => row.id.toString() === value)[0].name
    }
  }
}

  /**
   * 校验是否为空
   */
let filterEmpty = (value, unit = '') => {
  if (!value && parseInt(value) !== 0) return emptyTips
  return value + unit
}

let filterDollar = (value) => {
  return value ? `$ ${value}` : value
}

let packageOrderTypeFilter = (value) => {
  switch (value) {
    case 1:
      return 'first order'
    case 2:
      return 'pgrade order'
    case 3:
      return 'renew order'
    default:
      return emptyTips
  }
}

let orderTypeFilter = (value) => {
  switch (value) {
    case 1:
      return 'manual renew'
    case 2:
      return 'auto renew'
    default:
      return emptyTips
  }
}

let payStatusFilter = (value) => {
  switch (value) {
    case 0:
      return 'Wait Pay'
    case 1:
      return 'Payment'
    case 2:
      return 'Failed'
    default:
      return emptyTips
  }
}

export {
  appOsStatus,
  payTypeStatus,
  payStatus,
  dateFilter,
  selectFilter,
  filterEmpty,
  filterDollar,
  packageOrderTypeFilter,
  orderTypeFilter,
  payStatusFilter
}
