var api = require('../assets/js/api.js')
const emptyTips = '--'            // 为空显示
module.exports = {
  /**
   * 货币过滤器
   * @isThousand 是否千分位
   * @isW  是否万分位进制
   * 使用示例: {{money | moneyFilter(是否是千分位, 是否是万分位)}}
   */
  moneyFilter (v, isThousand, isW) {
    if (!v && v !== 0) return 0
    if (isW) {
      return parseFloat(v) >= 10000 ? (v / 10000).toFixed(1) + '万' : (v * 100 / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    } if (isThousand) { // 千分位并保留两位小数)
      return (v * 100 / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    } else { // 正常保留两位小数
      return (v * 100 / 100).toFixed(2)
    }
  },
  /**
   * 订单状态
   * @v 1待付款 2 待发货 3 待收货 4 待评价 5 已完成 6 平台关闭  7 取消订单
   */
  orderStatusFilter (v) {
    let statusArr = ['全部', '待付款', '待发货', '待收货', '待评价', '已完成', '平台关闭', '已取消', '退款中', '已退款', '待分享']
    return statusArr[v]
  },
  /**
   * 性别状态
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
      dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + ' ' + [d.getHours() >= 10 ? d.getHours() : '0' + d.getHours(), d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getSeconds() >= 10 ? d.getSeconds() : '0' + d.getSeconds()].join(':')
    } else {
      dformat = [ d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('-')
    }
    return dformat
  },
  /**
   * 时间戳转换年月日时分秒
   * @ns 要格式的时间
   */
  publicTime (time, nults) {
    let Time = new Date(time)
    let data = {
      Y: Time.getFullYear(),
      M: Time.getMonth() + 1,
      D: Time.getDate(),
      H: Time.getHours(),
      T: Time.getMinutes(),
      S: Time.getSeconds()
    }
    if (data.H < 10) {
      data.H = '0' + data.H
    }
    if (data.T < 10) {
      data.T = '0' + data.T
    }
    if (data.S < 10) {
      data.S = '0' + data.S
    }
    if (data.M < 10) {
      data.M = '0' + data.M
    }
    if (data.D < 10) {
      data.D = '0' + data.D
    }
    let nult = nults || '/'
    return data.Y + nult + data.M + nult + data.D + ' ' + data.H + ':' + data.T + ':' + data.S
  },

  publicTimeNew (time) {
    var Time = new Date(time)
    var data = {
      Y: Time.getFullYear(),
      M: Time.getMonth() + 1,
      D: Time.getDate(),
      H: Time.getHours(),
      T: Time.getMinutes(),
      S: Time.getSeconds()
    }
    if (data.H < 10) {
      data.H = '0' + data.H
    }
    if (data.T < 10) {
      data.T = '0' + data.T
    }
    if (data.S < 10) {
      data.S = '0' + data.S
    }
    if (data.M < 10) {
      data.M = '0' + data.M
    }
    if (data.D < 10) {
      data.D = '0' + data.D
    }
    return data.Y + '年' + data.M + '月' + data.D + '日' + data.H + ':' + data.T + ':' + data.S
  },
  /**
   * 转成时间(没有年)
   */
  publicTimeNoYear (time) {
    var Time = new Date(time)
    var data = {
      Y: Time.getFullYear(),
      M: Time.getMonth() + 1,
      D: Time.getDate(),
      H: Time.getHours(),
      T: Time.getMinutes(),
      S: Time.getSeconds()
    }
    if (data.H < 10) {
      data.H = '0' + data.H
    }
    if (data.T < 10) {
      data.T = '0' + data.T
    }
    if (data.S < 10) {
      data.S = '0' + data.S
    }
    if (data.M < 10) {
      data.M = '0' + data.M
    }
    if (data.D < 10) {
      data.D = '0' + data.D
    }
    return data.M + '月' + data.D + '日' + data.H + ':' + data.T + ':' + data.S
  },
  /**
   * 退款原因
   */
  refundReasonFilter (v) {
    let statusArr = ['订单不能按预计时间送达', '操作有误', '重复下单', '其他渠道价格更低', '不想买了', '其他原因']
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
   * 积分来源状态
   */
  // integralSourceFilter (v) {
  //   let statusArr = ['购买商品 ', '销售商品', '推荐用户', '消费积分兑换', '注册获取积分', '每日登录获取积分', '退回积分', '充值', '账户余额支出', '分销派送', '全球加权分红', '商品收益', '办公场地补贴', '芯片销售收益', '提现', '商品消费', '升级', '对账调整', '店补', '预付充值', '兑换通证', '购票', '分享赠送']
  //   return statusArr[v - 1]
  // },
  /**
   * 积分类型
   */
  propertyTypeFilter (v, flag) {
    if (!v && v !== 0) return false
    // let statusArr = ['消费积分', '通用积分', '金额', '服务积分', '芯豆', '联盟积分', '批发券']
    let statusArr = ['消费积分', '通用积分', '金额', '服务积分', '芯豆', '绿宝', '批发券']
    // 额外处理金额显示
    if (v === 3 && flag) statusArr[v - 1] = '元现金'
    return statusArr[v - 1]
  },
  /**
   * 订单详情订单状态
   */
  orderDetailSteFilter (v) {
    let statusArr = ['待付款 ', ' 待发货', '待收货', ' 待评价', '已完成', '平台关闭', '取消订单', ' 退款中', ' 已退款', '待分享']
    return statusArr[v - 1]
  },
  /**
   * 付款方式
   */
  payWayFilter (v) {
    let statusArr = ['未支付', '微信支付 ', '支付宝支付', '线下支付', '余额支付', '通用积分支付', '银联支付']
    return statusArr[v]
  },
  /**
   * 支付状态
   */
  paySteFilter (v) {
    let statusArr = ['未支付', '已支付 ', '支付失败']
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
   * 身份认证是否通过
   */
  idcardIsPassFilter (v) {
    let statusArr = ['已认证', '未认证']
    return statusArr[v]
  },
  /**
   * 隐藏手机号中间4位
   */
  filterPhone (val) {
    if (!val) return emptyTips
    return val.replace(/(.{3}).*(.{3})/, '$1*****$2')
  },
  /**
   * 身份证号码过滤
   */
  filterCard (val) {
    if (!val) return emptyTips
    return val.replace(/(.{2}).*(.{2})/, '$1************$2')
  },
  /**
   * 姓名只留一个汉字过滤
   */
  filterName (val) {
    if (!val) return emptyTips
    var name = ''
    for (var i = 0; i < val.length - 1; i++) {
      name += '*'
    }
    return val.replace(/(.{1}).*(.{0})/, '$1' + name)
  },
  /**
   * 过滤图片显示
   */
  filterImgUrl (val) {
    if (!val) return ''
    let res = val.match(/http/gi) || val.indexOf('data:image') > -1 ? val : api.default.imgUrl + val
    return res
  },
  /**
   * 证件类型过滤
   */
  IDStatusFilter (v) {
    let statusArr = ['身份证(包含大陆, 港澳台)', '护照']
    return statusArr[v - 1]
  },
  /**
   * 商品过滤最小价格
   */
  filterMinMoney (v) {
    if (!v || v.length <= 0) return false
    let skuPriceArr = []
    v.forEach((el) => {
      el.whetherSpecial ? skuPriceArr.push(el.goodsSpecialPrice) : skuPriceArr.push(el.goodsPrice)
    })
    // return Math.min(...skuPriceArr)
    return Math.min.apply(Math, skuPriceArr)
  },
  /**
   * 物流类型判断
   */
  filterLogistics (v) {
    let statusArr = ['包邮', '到付']
    return statusArr[v - 1]
  },
  /**
   * 详情页购买按钮文字
   */
  filterbuyBtnTxt (v) {
    let statusArr = ['消费积分购买', '联盟积分购买', '芯豆购买']
    return statusArr[v - 1]
  },
  /**
   * 详情页购买按钮文字
   */
  filterbuyBtnTxt2 (v) {
    let statusArr = {
      4: '消费积分购买',
      5: '联盟积分购买',
      3: '芯豆购买'}
    return statusArr[v]
  },
  /**
   * 详情页积分购买文字
   */
  filterPointsTxt (v) {
    let statusArr = ['消费积分', '联盟积分', '芯豆']
    return statusArr[v - 1]
  },
  /**
   * 文字截取
   */
  textInterception (txt, len) {
    if (!txt) return false
    txt = txt.length >= len ? txt.substr(0, len) + '...' : txt = txt.substr(0, len)
    return txt
  },
  /**
   * 文字截取
   */
  prizeType (v) {
    let statusArr = ['消费积分', '通用积分', '芯豆', '余额', '礼品']
    return statusArr[v - 1]
  },
  /**
   * 剩余几个人
   */
  fewNumFn (v) {
    let statusArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    var res = ''
    if (v <= statusArr.length) {
      res = statusArr[v - 1]
    } else {
      res = v
    }
    return res
  },
  /**
   * 是否拼主
   */
  ifHeadUser (v) {
    let statusArr = ['参与人', '拼主']
    return statusArr[v]
  },
  /**
   * 手机好加密
   */
  phoneSubstring (str) {
    let last = str.substring(7)
    return '********' + last
  },
  /**
   * 手机号加密
   */
  phoneSubstringTop (str) {
    let firs = str.substring(0, 3)
    let last = str.substring(7)
    return firs + '****' + last
  },
  /**
   * 倒计时
   */
  timeOutFn (time) {
    if (time < 0 || time === undefined) {
      return ''
    }
    if (time === 0) {
      return '00小时 00分 00秒'
    }
    var D = parseInt(time / 86400000)                                // 天
    var H = parseInt((time % 86400000) / 3600000)                   // 小时
    var T = parseInt(((time % 86400000) % 3600000) / 60000)           // 小时
    var S = parseInt((((time % 86400000) % 3600000) % 60000) / 1000)  // 秒

    if (H < 10) {
      H = '0' + H
    }
    if (T < 10) {
      T = '0' + T
    }
    if (S < 10) {
      S = '0' + S
    }
    var str = H + ' 小时' + T + ' 分' + S + ' 秒'
    if (D > 0) {
      str = D + ' 天' + str
    }
    return str
  },
  numberToW  (number) {
    let res = number
    if (number > 10000) {
      res = (number / 10000) + ' w'
    }
    return res
  },
  accMul (num1, num2) {
    let m = 0
    let s1 = num1.toString()
    let s2 = num2.toString()
    try { m += s1.split('.')[1].length } catch (e) {}
    try { m += s2.split('.')[1].length } catch (e) {}
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
  }
}
