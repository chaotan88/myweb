const {domain} = require('../../config/Utils')
const dateFns = require('date-fns')
const emptyTips = '--'            // 为空显示

module.exports = {
  /**
   * 过滤付款方式
   */
  filterPayType (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '微信支付'
        break
      case 2:
        res = '支付宝支付'
        break
      case 3:
        res = '线下支付'
        break
      case 4:
        res = '余额支付'
        break
      case 5:
        res = '通用积分'
        break
    }
    return res
  },

  /**
   * 过滤充值审核状态
   */
  filterAuditStatus (val) {
    if (val < 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '待审核'
        break
      case 2:
        res = '审核通过'
        break
      case 3:
        res = '审核不通过'
        break
    }
    return res
  },

  filterPayTypes (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '微信支付'
        break
      case 2:
        res = '支付宝支付'
    }
    return res
  },

  /**
   * 过滤支付状态
   */
  filterDealWithStatus (val, payType) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '未处理'
        break
      case 2:
        res = '已打款'
        break
      case 3:
        res = '回退'
        break
    }
    return res
  },

  /**
   * 过滤支付状态
   */
  filterPayStatus (val, payType) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '未付款'
        break
      case 2:
        res = '已付款'
        break
      case 3:
        res = '已退款'
        break
      case 4:
        res = '付款审核中'
        break
      case 5:
        res = '支付失败'
        break
    }
    return res
  },

  /**
   * 过滤提现状态
   */
  filterdealwithStatus (val, payType) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '待处理'
        break
      case 2:
        res = '已处理'
        break
      case 3:
        res = '回退'
        break
    }
    return res
  },

  filterMealStatus (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '开启'
        break
      case 2:
        res = '关闭'
        break
    }
    return res
  },

  /**
   * 过滤图片显示
   */
  filterImgUrl (val) {
    if (!val) return emptyTips
    let res = val.match(/http/gi) ? val : domain.ROOT_IMG + val
    return res
  },

  /**
  * 过滤金额显示
  */
  filterMoney (val) {
    if (!val && parseInt(val) !== 0) return ''
    let filterVal = ''
    let res = ''
    let value = val.toString()
    if (value.indexOf('.') !== -1) filterVal = value.split('.')
    var pattern = /(?=((?!\b)\d{3})+$)/g
    if (filterVal.length) {
      res = filterVal[0].toString().replace(pattern, ',') + '.' + filterVal[1]
    } else {
      res = value.replace(pattern, ',')
    }
    return res
  },

  /**
   * 过滤交易类型
   */
  filterTrade (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '消费积分'
        break
      case 2:
        res = '通用积分'
        break
      case 3:
        res = '账户余额'
        break
      default: res = emptyTips
    }
    return res
  },

  /**
   * 积分类型状态
  */
  filterIntegralType (v) {
    let statusArr = ['消费积分', '通用积分', '金额', '服务积分', '芯豆', '联盟积分', '采购劵', '']
    return statusArr[v - 1]
  },

  /**
   * 过滤交易记录交易内容
   */
  filterAddSource (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '购买商品'
        break
      case 2:
        res = '销售商品'
        break
      case 3:
        res = '推荐用户'
        break
      case 4:
        res = '支出积分'
        break
      case 5:
        res = '注册获取积分'
        break
      case 6:
        res = '每日登录获取积分'
        break
      case 7:
        res = '退回积分'
        break
      case 8:
        res = '充值'
        break
      case 9:
        res = '账户余额支出'
        break
      case 10:
        res = '分销派送'
        break
      case 11:
        res = '全球加权分红'
        break
      case 12:
        res = '商品收益'
        break
      case 13:
        res = '办公场地补贴'
        break
      case 14:
        res = '芯片销售收益'
        break
      case 15:
        res = '提现'
        break
      case 16:
        res = '商品消费'
        break
      case 17:
        res = '升级'
        break
      case 18:
        res = '扣款（对账调整（不计入业绩））'
        break
      case 19:
        res = '店补'
        break
      case 20:
        res = '预付充值'
        break
      case 21:
        res = '兑换通证'
        break
      case 22:
        res = '购票'
        break
      case 23:
        res = '分享'
        break
      case 26:
        res = '购票分佣'
        break
      case 27:
        res = '管理奖'
        break
      case 28:
        res = '店补'
        break
      case 29:
        res = '签到'
        break
      case 30:
        res = '浏览'
        break
      case 32:
        res = '评价'
        break
      case 33:
        res = '扣款（兑换通正（不计入业绩）'
        break
      case 34:
        res = '扣款（对账调账（计入业绩）'
        break
      case 35:
        res = '充值（商品消费（计入业绩）'
        break
      case 36:
        res = '充值（对账调账（不计入业绩）'
        break
      case 37:
        res = '充值（对账调账（计入业绩）'
        break
      case 38:
        res = '充值（商城退款（不计入业绩）'
        break
      case 39:
        res = '大转盘抽奖'
        break
      case 41:
        res = '提现退回'
        break
      case 42:
        res = '转赠'
        break
      case 43:
        res = '好友赠送'
        break
      case 44:
        res = '交易所兑换'
        break
      case 45:
        res = '抢购商品'
        break
      case 46:
        res = '批发商品'
        break
      case 47:
        res = '出售批发商品'
        break
      case 48:
        res = '买卖仓直推奖励'
        break
      case 49:
        res = '批发券福利'
        break
      default: res = emptyTips
    }
    return res
  },

  /**
   * 过滤结算状态
   */
  filterDisStatus (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '待结算'
        break
      case 2:
        res = '已结算'
        break
    }
    return res
  },

  /**
   * 过滤认证状态
   */
  filterAuthentication (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '未支付'
        break
      case 1:
        res = '已支付'
        break
    }
    return res
  },

  /**
   * 过滤身份认证状态
   */
  filterCardStatus (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '已认证'
        break
      case 1:
        res = '未认证'
        break
    }
    return res
  },

  /**
   * 过滤是否激活
   */
  filterOpen (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '待激活'
        break
      case 1:
        res = '已激活'
        break
      case 2:
        res = '激活失败'
        break
    }
    return res
  },

  /**
   * 过滤证件类型
   */
  filterCardType (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '身份证'
        break
      case 2:
        res = '护照'
        break
    }
    return res
  },

  /**
   * 过滤会员类型
   */
  filterMemberType (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '线上升级'
        break
      case 2:
        res = '手动升级'
        break
    }
    return res
  },
  //
  // filterDeductionType (val) {
  //   if (!val) return emptyTips
  //   let res = ''
  //   switch (parseInt(val)) {
  //     case 1:
  //       res = '账户通用积分抵扣'
  //       break
  //     case 2:
  //       res = '账户买卖仓预计收益抵扣'
  //       break
  //     case 3:
  //       res = '夸账户买卖仓预计收益抵扣'
  //       break
  //   }
  //   return res
  // },
  /**
   * 过滤性别
   */
  filterSex (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '保密'
        break
      case 1:
        res = '男'
        break
      case 2:
        res = '女'
        break
    }
    return res
  },

  filterOrderStatus (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '待付款'
        break
      case 2:
        res = '待发货'
        break
      case 3:
        res = '待收货'
        break
      case 4:
        res = '待评价'
        break
      case 5:
        res = '已完成'
        break
      case 6:
        res = '平台关闭'
        break
      case 7:
        res = '取消订单'
        break
      case 8:
        res = '退款中'
        break
      case 9:
        res = '已退款'
        break
    }
    return res
  },

  /**
   * 过滤充值类型状态
   */
  filterRechargeType (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 8:
        res = '充值升级（计入业绩）'
        break
      case 18:
        res = '对账调整（计入业绩）'
        break
      case 36:
        res = '商城退款（不计入业绩）'
        break
      case 37:
        res = '兑换通正（不计入业绩）'
        break
      case 38:
        res = '对账调账（不计入业绩）'
        break
      case 39:
        res = '商品消费（计入业绩）'
        break
    }
    return res
  },

  /**
   * 自动分佣
   */
  filterMaid (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '否'
        break
      case 1:
        res = '是'
        break
    }
    return res
  },

  /**
   * 全部科目
   */
  filterSource (value, unit = '') {
    if (!value && parseInt(value) !== 0) return emptyTips
    let res = ''
    switch (parseInt(value)) {
      case 1:
        res = '预付充值'
        break
      case 2:
        res = '抢购商品'
        break
      case 3:
        res = '批发商品'
        break
      case 4:
        res = '平台购物'
        break
      case 5:
        res = '平台充值'
        break
      case 6:
        res = '平台扣款'
        break
      case 7:
        res = '批发售出'
        break
      case 8:
        res = '提现'
        break
      case 9:
        res = '提现回退'
        break
      case 10:
        res = '积分转赠'
        break
      case 11:
        res = '好友赠送'
        break
      case 12:
        res = '直推奖'
        break
      case 13:
        res = '团队奖'
        break
    }
    return res
  },
  /**
   * 积分来源
   */
  filterIntegralSource (value, unit = '') {
    if (!value && parseInt(value) !== 0) return emptyTips
    let res = ''
    switch (parseInt(value)) {
      case 1:
        res = '购买商品'
        break
      case 2:
        res = '销售商品'
        break
      case 3:
        res = '推荐用户'
        break
      case 4:
        res = '支出积分'
        break
      case 5:
        res = '注册获取积分'
        break
      case 6:
        res = '每日登录获取积分'
        break
      case 7:
        res = '退回积分'
        break
      case 8:
        res = '充值升级'
        break
      case 9:
        res = '支出余额'
        break
      case 10:
        res = '分销派送'
        break
      case 11:
        res = '全球加权分红'
        break
      case 12:
        res = '商品收益'
        break
      case 13:
        res = '办公场地补贴'
        break
      case 14:
        res = '芯片销售收益'
        break
      case 15:
        res = '提现'
        break
      case 16:
        res = '商品消费'
        break
      case 17:
        res = '升级'
        break
      case 18:
        res = '扣款(对账调整,计入业绩)'
        break
      case 19:
        res = '店补'
        break
      case 20:
        res = '预付充值'
        break
      case 21:
        res = '兑换通证'
        break
      case 22:
        res = '购票'
        break
      case 23:
        res = '分享商品'
        break
      case 24:
        res = '平级奖'
        break
      case 25:
        res = '超越奖 '
        break
      case 26:
        res = '购票分佣'
        break
      case 27:
        res = '管理奖'
        break
      case 28:
        res = '店补'
        break
      case 29:
        res = '芯豆签到'
        break
      case 30:
        res = '芯豆浏览商品'
        break
      case 31:
        res = '兑换商品'
        break
      case 32:
        res = '芯豆评价商品'
        break
      case 33:
        res = '扣款（兑换通正（不计入业绩））'
        break
      case 34:
        res = '扣款（对账调账（不计入业绩））'
        break
      case 35:
        res = '充值（商品消费（计入业绩）'
        break
      case 36:
        res = '充值（对账调账（不计入业绩））'
        break
      case 37:
        res = '充值（对账调账（计入业绩））'
        break
      case 38:
        res = '充值（商城退款（不计入业绩））'
        break
    }
    return res + unit
  },

  /**
   * 隐藏手机号中间4位
   */
  filterPhone (val) {
    if (!val) return
    return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  },

  /**
   * 保留小数位数，默认两位
   */
  numToFixed (val, len) {
    if (!val || val === 0) return emptyTips
    let filterLen = len || 2
    let valStr = val.toString()
    if (valStr.indexOf('.') !== -1) {
      return valStr.slice(0, valStr.indexOf('.') + filterLen + 1)
    } else {
      return valStr
    }
  },

  /**
   * 自动补全小数点后两位
   */
  blurAutoCompletion (vm, obj) {
    if (!obj || !vm[obj]) return ''
    let val = vm[obj].toString()
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
   * 补全结束时间，精确到23:59:59
   */
  completionEndDate (value) {
    if (!value) return ''
    let res = dateFns.format(new Date(value).getTime() + (24 * 60 * 60 * 1000 - 1), 'YYYY-MM-DD HH:mm:ss')
    return res
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
   * 校验是否为空
   */
  filterEmpty (value, unit = '') {
    if (!value && parseInt(value) !== 0) return emptyTips
    return value + unit
  },
  /**
   * 审核状态
   */
  filterDealWith (key) {
    let arr = {
      1: '待审核',
      2: '审核通过',
      3: '已打回',
      4: '审核通过'
    }
    return arr[key] || ''
  },
  /**
   * 抵扣类型
   */
  filterDeductionType (key) {
    let arr = {
      1: '账户通用积分抵扣',
      2: '账户买卖仓预计收益抵扣',
      3: '跨账户买卖仓预计收益抵扣'
    }
    return arr[key] || ''
  },
  /**
   * 审核记录操作状态
   */
  filterifDeduction (key) {
    let arr = {
      1: '是',
      0: '否'
    }
    return arr[key] || ''
  }
}
