import dateFns from 'date-fns'
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

// 7.账单状态
let auditStatus = v => {
  if (v >= 0) {
    let statusArr = ['未核查', '待查账', '账单已确认', '查账不通过']
    return statusArr[v]
  }
}

// 7.发票类型
let invoiceTypeStatus = v => {
  if (v >= 0) {
    let statusArr = ['纸质发票', '电子发票']
    return statusArr[v]
  }
}

// 8.是否开发票
let isinvoiceStatus = v => {
  if (v >= 0) {
    let statusArr = ['未开', '已开']
    return statusArr[v]
  }
}

// 9.广告组类型
let adTypeStatus = v => {
  if (v >= 0) {
    let statusArr = ['企业', '个人']
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

// 11.合同状态
let contractStatus = v => {
  if (v >= 0) {
    let statusArr = ['待审核', '审核通过', '审核不通过', '已签署']
    return statusArr[v - 1]
  }
}

// 12.投放方式
let orderTypeStatus = v => {
  if (v >= 0) {
    let statusArr = ['单点投放', '区域投放 ']
    return statusArr[v - 1]
  }
}

// 13.播放内容
let playContentStatus = v => {
  if (v >= 0) {
    let statusArr = ['图片', '视频 ']
    return statusArr[v - 1]
  }
}

// 14.屏幕栏数
let screenColumnStatus = v => {
  if (v >= 0) {
    let statusArr = ['一栏', '二栏', '三栏', '四栏', '五栏']
    return statusArr[v - 1]
  }
}

// 15.频次
let frequencyStatus = v => {
  if (v >= 0) {
    let statusArr = ['60次／天', '120次／天 ', '180次／天']
    return statusArr[v - 1]
  }
}

// 16.时长
let durationStatus = v => {
  if (v >= 0) {
    let statusArr = ['5s', '10s ', '15s']
    return statusArr[v - 1]
  }
}

// 16.素材审核-整个
let assessStatus = v => {
  if (v >= 0) {
    let statusArr = ['未上传', '审核中', '审核通过', '审核不通过']
    return statusArr[v]
  }
}

// 16.图片.视频审核-单个
let imgVideoStatus = v => {
  if (v >= 0) {
    let statusArr = ['待审核', '审核通过', '审核不通过']
    return statusArr[v - 1]
  }
}

// 17.播放状态
let broadStatus = v => {
  if (v >= 0) {
    let statusArr = ['未播放', '播放中', '已播放']
    return statusArr[v - 1]
  }
}

// 18.行为
let actionStatus = v => {
  if (v >= 0) {
    let statusArr = ['终端分配', '提现管理', '消息推送']
    return statusArr[v - 1]
  }
}

// 19.申请状态
let applyStatus = v => {
  if (v >= 0) {
    let statusArr = ['申请中', '审核通过', '审核不通过', '采购中', '已采购']
    return statusArr[v]
  }
}

// 20.采购状态
let procurementStatus = v => {
  if (v >= 0) {
    let statusArr = ['审核中', '审核通过', '部分采购', '完成采购']
    return statusArr[v]
  }
}

// 21.运营里的显示隐藏
let isshowStatus = v => {
  if (v >= 0) {
    let statusArr = ['否', '是']
    return statusArr[v]
  }
}

// 22.合作类型
let applyType = v => {
  if (v >= 0) {
    let statusArr = ['个人', '企业']
    return statusArr[v]
  }
}

// 推送状态
let pushStatus = v => {
  let statusArr = ['未推送', '进行中', '完成']
  return statusArr[v]
}

// 时间戳-日期时间  dateFilter('YYYY-MM-DD HH:mm:ss')
let dateFilter = (v, type) => {
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

export {
  appOsStatus,
  payTypeStatus,
  auditStatus,
  invoiceTypeStatus,
  isinvoiceStatus,
  adTypeStatus,
  payStatus,
  contractStatus,
  orderTypeStatus,
  playContentStatus,
  screenColumnStatus,
  frequencyStatus,
  durationStatus,
  assessStatus,
  imgVideoStatus,
  broadStatus,
  actionStatus,
  applyStatus,
  procurementStatus,
  isshowStatus,
  dateFilter,
  pushStatus,
  applyType,
  selectFilter
}
