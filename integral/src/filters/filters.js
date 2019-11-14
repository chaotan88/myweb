var api = require('../assets/js/api.js')
const emptyTips = '--'            // 为空显示

module.exports = {
  money (val) {
    val = val.toString().replace(/\$|,/g, '')
    if (isNaN(val)) {
      val = '0'
    }
    val = Math.floor(val * 100 + 0.50000000001)
    let cents = val % 100
    val = Math.floor(val / 100).toString()
    if (cents < 10) {
      cents = '0' + cents
    }
    for (var i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
      val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3))
    }

    return (val + '.' + cents)
  },
  /**
   * 价格每三位加一个逗号
   */
  price (val) {
    val = val.toString().replace(/\$|,/g, '')
    if (isNaN(val)) {
      val = '0'
    }
    val = Math.floor(val * 100 + 0.50000000001)
    let cents = val % 100
    val = Math.floor(val / 100).toString()
    if (cents < 10) {
      cents = '0' + cents
    }
    for (var i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
      val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3))
    }

    return (val)
  },
  /**
   * 货币过滤器
  */
  moneyFilter (v) {
    if (!v && v < 0) return
    return '¥' + (v * 100 / 100).toFixed(2)
  },
  /**
   * 订单状态
   * @v 1待付款 2 待发货 3 待收货 4 待评价 5 已完成 6 平台关闭  7 取消订单
  */
  orderStatusFilter (v) {
    let statusArr = ['全部', '待付款', '待发货', '待收货', '待评价', '已完成', '平台关闭', '已取消']
    return statusArr[v]
  },
  /**
   * 性别状态
  */
  IDStatusFilter (v) {
    let statusArr = ['身份证', '护照']
    return statusArr[v - 1]
  },
  /**
   * 证件类型
  */
  sexStatusFilter (v) {
    let statusArr = ['保密', '男', '女']
    return statusArr[v]
  },
  /**
   * 退款状态
  */
  refundStatusFilter (v) {
    let statusArr = ['', '退款中', '已退款', '撤销退款']
    return statusArr[v]
  },

  /**
   * 保留小数位数，默认两位
   */
  numToFixed (val, len) {
    if (val === undefined) return emptyTips
    // if (!val || val === 0) return emptyTips
    let filterLen = len || 2
    let valStr = val.toString()
    if (valStr.indexOf('.') !== -1) {
      return valStr.slice(0, valStr.indexOf('.') + filterLen + 1)
    } else {
      return valStr
    }
  },

  /**
   * 评论状态
  */
  commentsFilter (v) {
    let statusArr = ['', '好评', '中评', '差评']
    return statusArr[v]
  },
  /**
   * 时间戳转换
   * @ns 要格式的时间
   * isTime 是否要时分秒 1 带时分秒 0 不带时分秒
   * @使用 formatDate(time, 0)
  */
  formatDate (ns, isTime) {
    if (!ns) return
    var d = new Date(ns)
    var dformat
    if (isTime) {
      dformat = [ d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('-') + ' ' + [ d.getHours(), d.getMinutes(), d.getSeconds() ].join(':')
    } else {
      dformat = [ d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('-')
    }
    return dformat
  },
  /**
   * 聊天格式时间
  */
  customTime (sendTime) {
    var d = new Date(sendTime)
    var sendTimeFormat = [ d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('-') + ' ' + [ d.getHours(), d.getMinutes() ].join(':')         // 时间戳转年月日
    var outpuTime      // 输入的时间格式
    var nowTime = new Date().getTime()                               // 当前时间
    var dtime = (nowTime - sendTime) / (1000 * 60 * 60)              // 小时差
    if (dtime <= 24) {
      outpuTime = sendTimeFormat.substr(10, 8)                       // 今天
    } else if (dtime > 24 && dtime < 48) {
      outpuTime = '昨天' + sendTimeFormat.substr(10, 8)              // 昨天
    } else {
      outpuTime = sendTimeFormat                                    // 其他时间
    }
    return outpuTime
  },
  /**
   * 退款原因
  */
  refundReasonFilter (v) {
    let statusArr = ['订单不能按预计时间送达', '操作有误', '重复下单', '其他渠道价格更低', '不想买了', '其他原因']
    return statusArr[v - 1]
  },
  /**
   * 推荐方式
  */
  recommendTypeFilter (v) {
    let statusArr = ['直接推荐', '间接推荐']
    return statusArr[v - 1]
  },
  /**
   * 创客开店
  */
  hasShopFilter (v) {
    let statusArr = ['免费开店', '开店审核中']
    return statusArr[v]
  },
  /**
   * 店铺审核状态
  */
  shopSteFilter (v) {
    let statusArr = ['未审核 ', '审核通过', '审核不通过']
    return statusArr[v - 1]
  },
  /**
   * 积分类型状态
  */
  integralTypeFilter (v) {
    let statusArr = ['消费积分', '通用积分', '金额', '服务积分', '芯豆', '绿宝', '批发券']
    return statusArr[v - 1]
  },
  /**
   * 积分来源状态
  */
  // integralSourceFilter (v) {
  //   let statusArr = ['购买商品', '销售商品', '推荐用户', '消费积分兑换', '注册获取积分', '每日登录获取积分', '退回积分', '充值', '账户余额支出', '分销派送', '全球加权分红', '商品收益', '办公场地补贴', '芯片销售收益', '提现', '分销派送', '升级', '对账调整', '店补', '预付充值', '兑换通证', '会议购票', '分享赠送', '店补']
  //   return statusArr[v - 1]
  // },
  /**
   * 订单详情订单状态
  */
  orderDetailSteFilter (v) {
    let statusArr = ['待付款 ', ' 待发货', '待收货', ' 待评价', '已完成', '平台关闭', '取消订单', ' 退款中', ' 已退款']
    return statusArr[v - 1]
  },
  /**
   * 付款方式
  */
  payWayFilter (v) {
    let statusArr = ['未支付', '微信支付 ', ' 支付宝支付', '线下支付', ' 余额支付']
    return statusArr[v]
  },
  /**
   * 支付状态
  */
  paySteFilter (v) {
    let statusArr = ['未支付', '已支付 ', '支付失败', '付款审核中']
    return statusArr[v]
  },
  /**
   * 合伙人升级 身份认证状态
  */
  idcardAuthFilter (v) {
    let statusArr = ['已认证', '未认证']
    return statusArr[v]
  },
  /**
   * 银行卡类型
  */
  cardTypeFilter (v) {
    // if (!v) return '未认证'
    let statusArr = ['储蓄卡', '借记卡']
    return statusArr[v - 1]
  },
  /**
   * 银行卡号
  */
  cardNoFilter (val) {
    if (!val) return emptyTips
    return val.replace(/(\d{4})\d{1,}(\d{4})/, '$1  ****  ****  $2')
  },

  /**
   * 是否激活
  */
  isActiveFilter (v) {
    let statusArr = ['未激活', '已激活', '激活失败']
    return statusArr[v]
  },

  /**
   * 隐藏手机号中间4位
   */
  filterPhone (val) {
    if (!val) return emptyTips
    return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  },

  /**
   * 隐藏中间位--证件号
   */
  filterID (val) {
    if (!val) return emptyTips
    return val.replace(/([0-9A-Za-z]{2})[0-9A-Za-z]{1,}([0-9A-Za-z]{2})/, '$1**********$2')
  },

  /**
   * 隐藏中间位--姓名
   */
  filterName (val) {
    if (!val) return emptyTips
    let len = val.toString().length
    let suffix = ''
    for (let i = 0; i < len - 1; i++) {
      suffix += '*'
    }
    return val.replace(/(.{1}).{1,}/, '$1' + suffix)
  },

  /**
   * 保留小数位数，默认两位
   */
  // numToFixed (val, len) {
  //   if (!val || val === 0) return ''
  //   let filterLen = len || 2
  //   let valStr = val.toString()
  //   return valStr.slice(0, valStr.indexOf('.') + filterLen + 1)
  // },

  /**
   * 时间过滤器
   */
  // filterDate (value, type) {
  //   if (!value) return emptyTips
  //   let filterType = type || 'YYYY-MM-DD HH:mm:ss'
  //   return dateFns.format(value, filterType)
  // },

  /**
   * 校验是否为空
   */
  filterEmpty (value, unit = '') {
    if (!value) return emptyTips
    return value + unit
  },
  /**
   * 过滤图片显示
   */
  filterImgUrl (val) {
    if (!val) return ''
    let res = val.match(/http/gi) ? val : api.default.imgUrl + val
    return res
  }
}
