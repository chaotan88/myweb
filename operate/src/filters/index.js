const {domain} = require('../../config/Utils')
const dateFns = require('date-fns')
const emptyTips = '--'            // 为空显示

module.exports = {
  /**
   * 计算sku最小单价
   */
  filterSkuMinPrice (obj) {
    if (!obj || !obj.length) return emptyTips
    let minPrice = null
    obj.forEach((row) => {
      let price = [row.goodsPrice]
      if (minPrice) price.push(minPrice)
      if (row.whetherSpecial === 1) price.push(row.goodsSpecialPrice)
      minPrice = Math.min(...price)
    })
    return minPrice
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

  /**
   * 过滤票务状态
   */
  filterTicketStatus (val) {
    if (val < 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '关闭'
        break
      case 1:
        res = '开启'
        break
    }
    return res
  },

  /**
   * 过滤商品状态
   */
  filterGoodsStatus (val) {
    if (!val) return emptyTips
    let results = ''
    switch (parseInt(val)) {
      case 1:
        results = '待审核'
        break
      case 2:
        results = '审核通过'
        break
      case 3:
        results = '审核不通过'
        break
    }
    return results
  },

  /**
   * 详情过滤商品状态
   */
  filterGoodsType (val) {
    if (val < 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '正常状态'
        break
      case 1:
        res = '退款中'
        break
      case 2:
        res = '已退款'
        break
      case 3:
        res = '撤销退款申请'
        break
    }
    return res
  },

  /**
   * 过滤结算方式
   */
  filterSettlement (val) {
    if (!val) return emptyTips
    let results = ''
    switch (parseInt(val)) {
      case 1:
        results = '周期结算'
        break
      case 2:
        results = '额度结算'
        break
      case 3:
        results = '实时结算'
        break
      case 4:
        results = '预付结算'
        break
    }
    return results
  },

  /**
   * 过滤结算结算状态
   */
  filterSettlementState (val) {
    if (!val) return emptyTips
    let results = ''
    switch (parseInt(val)) {
      case 1:
        results = '待结算'
        break
      case 2:
        results = '已结算'
        break
    }
    return results
  },

  /**
   * 过滤应用端
   */
  filterAppType (val) {
    if (val < 0) return emptyTips
    let res = ''
    switch (val) {
      case 1:
        res = '移动端'
        break
      case 2:
        res = 'pc端'
        break
    }
    return res
  },

  /**
   * 过滤PC投放位置
   */
  filterPcPutLocation (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = 'PC端商城首页'
        break
      case 2:
        res = 'PC端商品分类页'
        break
      case 3:
        res = 'PC端创客中心'
        break
    }
    return res
  },

  /**
   * 过滤Mobile投放位置
   */
  filterMobilePutLocation (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '移动端商城首页'
        break
      case 2:
        res = '移动端商城首页定制广告位'
        break
    }
    return res
  },

  /**
   * 过滤商品审核状态
   */
  filterGoodsReviewStatus (val) {
    if (val < 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '待审核'
        break
      case 1:
        res = '审核通过'
        break
      case 2:
        res = '审核不通过'
        break
      case 3:
        res = '未提交审核'
        break
    }
    return res
  },

  /**
   * 过滤订单类型
   */
  filterColumnType (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '关联商品'
        break
      case 2:
        res = '关联地址'
        break
    }
    return res
  },

  /**
   * 过滤收货状态
   */
  filterConfirmStatus (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '未收货'
        break
      case 1:
        res = '已收货'
        break
    }
    return res
  },

  /**
   * 过滤订单状态
   */
  filterOrderStatus (val) {
    if (!val) return emptyTips
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
      case 10:
        res = '待分享'
        break
    }
    return res
  },

  /**
   * 过滤支付类型
   */
  filterPayType (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '微信'
        break
      case 2:
        res = '支付宝'
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
      case 6:
        res = '银联支付'
        break
      case 7:
        res = '买卖仓提货'
        break
    }
    return res
  },

  /**
   * 过滤支付状态
   */
  filterPayStatus (val) {
    if (!val) return emptyTips
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
   * 过滤评价类型
   */
  filterEvaluateStatus (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '好评'
        break
      case 2:
        res = '中评'
        break
      case 3:
        res = '差评'
        break
    }
    return res
  },

  /**
   * 过滤商品分类
   */
  filterGoodsTypeLevel (val) {
    if (!val && val < 0) return emptyTips
    let res = ''
    val = (val === '0' || val === 0) ? 0 : parseInt(val)
    switch (parseInt(val)) {
      case 1:
        res = '大类'
        break
      case 2:
        res = '中类'
        break
      case 3:
        res = '小类'
        break
    }
    return res
  },

  /**
   * 过滤店铺类型
   */
  filterShopType (val) {
    if (val === null) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '云店铺'
        break
      case 2:
        res = '独立部署'
        break
    }
    return res
  },

  /**
   * 过滤
   */
  filterIsNot (val) {
    if (val === null) return emptyTips
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
   * 过滤
   */
  filterRecommend (val) {
    if (val === null) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '不推荐'
        break
      case 1:
        res = '推荐'
        break
    }
    return res
  },

  /**
   * 过滤是否积分兑换
   */
  filterWhetherUsePoints (val) {
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
   * 上下架状态
   */
  filterSaleStatus (val) {
    if (val === null) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '已上架'
        break
      case 2:
        res = '已下架'
        break
    }
    return res
  },

  /**
   * 过滤栏目是否套餐专区
   */
  filterIfSetmeat (val) {
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
   * 过滤是否推荐商品
   */
  filterGoodsRecommend (val) {
    if (val < 0) return emptyTips
    let res = ''
    val = (val === '0' || val === 0) ? 0 : parseInt(val)
    switch (parseInt(val)) {
      case 0:
        res = '不推荐'
        break
      case 1:
        res = '推荐'
        break
    }
    return res
  },

  /**
   * 过滤栏目是否推荐到首页
   */
  filterRecommendIndexStatus (val) {
    if (val < 0) return emptyTips
    let res = ''
    val = (val === '0' || val === 0) ? 0 : parseInt(val)
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
   * 过滤积分类型
   */
  filterSourceType (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '消费积分'
        break
      case 2:
        res = '通用积分'
        break
      case 3:
        res = '金额'
        break
      case 4:
        res = '服务积分'
        break
    }
    return res
  },

  /**
   * 过滤规则内容
   */
  filterRuleType (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 29:
        res = '签到送积分'
        break
      case 5:
        res = '注册送芯豆'
        break
      case 23:
        res = '分享商品送芯豆'
        break
      case 30:
        res = '浏览商品'
        break
      case 32:
        res = '商品评价'
        break
    }
    return res
  },

  /**
   * 过滤规则内容 - 交易记录
   */
  filterRuleTypeRecord (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '购买商品'
        break
      case 7:
        res = '退回'
        break
      case 4:
        res = '兑换商品'
        break
      case 29:
        res = '签到'
        break
      case 5:
        res = '注册'
        break
      case 23:
        res = '分享'
        break
      case 30:
        res = '浏览'
        break
      case 32:
        res = '评价'
        break
    }
    return res
  },

  /**
   * 过滤限时特卖 - 买卖仓 - 抢购管理 - 抢购状态 （1：待支付、2：已支付、3：确认收货 4：已对账，5：已结算 6：已取消）
   */
  filterRushAdmin (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '待支付'
        break
      case 2:
        res = '已支付'
        break
      case 3:
        res = '确认收货'
        break
      case 4:
        res = '已对账'
        break
      case 5:
        res = '已结算'
        break
      case 6:
        res = '已取消'
    }
    return res
  },

  /**
   * 过滤规则说明
   */
  filterRuleDescription (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 29:
        res = '每签到一次记录一天，获得当天的收益'
        break
      case 5:
        res = '用户注册成功'
        break
      case 23:
        res = '推荐商品给好友：微信、QQ、微博'
        break
      case 30:
        res = '浏览商品，超过15S获取，循环获取'
        break
      case 32:
        res = '购买完成商品后进行商品评价反馈'
        break
    }
    return res
  },

  /**
   * 属性类型
   */
  filterAttributeType (val) {
    if (!val) return emptyTips
    let results = ''
    switch (parseInt(val)) {
      case 1:
        results = '复选框'
        break
      case 2:
        results = '文本框'
        break
    }
    return results
  },

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
   * 交易类型
   */
  filterTransactionype (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 5:
        res = '芯豆'
        break
    }
    return res
  },

  /**
   * 过滤奖品类型
   */
  filterPrizeType (value, unit = '') {
    if (!value && parseInt(value) !== 0) return emptyTips
    let res = ''
    switch (parseInt(value)) {
      case 1:
        res = '消费积分'
        break
      case 2:
        res = '通用积分'
        break
      case 3:
        res = '芯豆'
        break
      case 4:
        res = '余额'
        break
      case 5:
        res = '礼品'
        break
    }
    return res + unit
  },

  /**
   * 过滤兑奖状态
   */
  filterCashStatus (value, unit = '') {
    if (!value && parseInt(value) !== 0) return emptyTips
    let res = ''
    switch (parseInt(value)) {
      case 0:
        res = '未兑奖'
        break
      case 1:
        res = '已兑奖'
        break
    }
    return res + unit
  },

  /**
   * 过滤天数
   */
  filterDateNum (value, unit = '') {
    if (!value && parseInt(value) !== 0) return emptyTips
    let res = ''
    switch (parseInt(value)) {
      case 0:
        res = '第七天'
        break
      case 1:
        res = '第一天'
        break
      case 2:
        res = '第二天'
        break
      case 3:
        res = '第三天'
        break
      case 4:
        res = '第四天'
        break
      case 5:
        res = '第五天'
        break
      case 6:
        res = '第六天'
        break
    }
    return res + unit
  },

  /**
   * 过滤活动状态
   */
  filterActivityState (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '未开始'
        break
      case 1:
        res = '进行中'
        break
      case 2:
        res = '已结束'
        break
    }
    return res
  },
  /**
   * 商户认证审核状态
   */
  filterShopStatus (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
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

   /**
   * 过滤结算状态
   */
  filtercommissionStatus (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '待结算'
        break
      case 1:
        res = '已结算'
        break
      case 2:
        res = '已冻结'
        break
    }
    return res
  },
  /**
   * 过滤与团长关系
   */
  filterRelation (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '非好友'
        break
      case 1:
        res = '直推好友'
        break
      case 2:
        res = '本人'
        break
    }
    return res
  },
  /**
   * 优惠券类型
   */
  filterCouponType (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '代金券'
        break
      case 2:
        res = '折扣券'
        break
    }
    return res
  },
  /**
   * 开团状态
   */
  filterGroupStatus (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '进行中'
        break
      case 2:
        res = '已拼成'
        break
      case 3:
        res = '拼团失败'
        break
    }
    return res
  },

  /**
   * 过滤挂售状态
   */
  filterHangSaleType (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '未挂售'
        break
      case 2:
        res = '挂售中'
        break
      case 3:
        res = '已售出'
        break
      case 4:
        res = '待提货'
        break
      case 5:
        res = '已提货'
        break
      case 6:
        res = '已取消'
        break
    }
    return res
  },

  /**
   * 过滤挂售状态
   */
  filterwWoleSaleType (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '未挂售'
        break
      case 2:
        res = '挂售中'
        break
      case 3:
        res = '已售出'
        break
      case 4:
        res = '待提货'
        break
      case 5:
        res = '已提货'
        break
      case 6:
        res = '已取消'
        break
      case 7:
        res = '申请抵扣'
        break
      case 8:
        res = '抵扣售出'
        break
    }
    return res
  },

  /**
   * 时间过滤器
   */
  filterDate (value, type) {
    if (!value) return emptyTips
    let filterType = type || 'YYYY-MM-DD HH:mm:ss'
    return dateFns.format(parseInt(value), filterType)
  },

  /**
   * 时间过滤器2
   */
  filterDateDot (value, type) {
    if (!value) return emptyTips
    let res = ''
    let filterType = type || 'YYYY-MM-DD HH:mm:ss'
    if (value.toString().indexOf('-') !== -1 || value.toString().indexOf(':') !== -1) {
      res = value
    } else {
      res = dateFns.format(parseInt(value), filterType)
    }
    if (res.toString().indexOf('.') !== -1) {
      res = res.split('.')[0]
    }
    return res
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
    if (!val || val === 0) return ''
    let filterLen = len || 2
    let valStr = val.toString()
    return valStr.slice(0, valStr.indexOf('.') + filterLen + 1)
  },

  /**
   * 过滤图片显示
   */
  filterImgUrl (val) {
    if (!val) return emptyTips
    let res = val.toString().match(/http/gi) ? val : domain.ROOT_IMG + val
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
   * 校验是否为空
   */
  filterEmpty (value, unit = '') {
    if (!value) return emptyTips
    return value + unit
  },

  /**
   * 校验0也为空
   */
  filterEmptys (value, unit = '') {
    if (!value && parseInt(value) === 0) return emptyTips
    return value + unit
  },

  /**
   * 校验是否为空 ( 0 显示)
   */
  filterEmptyWithZero (value, unit = '') {
    if (value === null || value === '') return emptyTips
    return value + unit
  },

  /**
   * 价格自动补全
   */
  componentUpdated (el, binding, vNode) {
    let element = el.getElementsByTagName('input')[0]
    let count = 0
    let execute = () => {
      let vNodeVal = vNode.data.model.value
      if ((!vNodeVal && parseInt(vNodeVal) !== 0) || element === document.activeElement) return
      vNodeVal = vNodeVal.toString()
      if (vNodeVal.indexOf('.') === -1) {
        vNodeVal += '.00'
      } else {
        let splitRight = vNodeVal.split('.')[1]
        if (splitRight.length === 0) {
          vNodeVal += '00'
        } if (splitRight.length === 1) {
          vNodeVal += '0'
        }
      }
      vNode.data.model.callback(vNodeVal)
    }
    // 初始化自动补全
    execute()

    // 鼠标失去焦点自动补全
    element.onblur = () => {
      execute()
      count++
      // 二次触发避免el-input校验冲突
      if (count < 2) {
        element.focus()
        setTimeout(() => {
          element.blur()
          count = 0
        }, 0)
      }
    }
  }
}
