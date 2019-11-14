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
   * 结算状态
   */
  filterSettleStatus (val) {
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
   * 过滤审核状态
   */
  filterReviewStatus (val) {
    if (val < 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '未审核'
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
   * 过滤上下架状态
   */
  filterSaleStatus (val, type) {
    let res = ''
    if (val === true || val === false) {
      res = val === false ? '下架' : '上架'
    } else {
      if (!val && type) return type
      if (!val) return emptyTips
      switch (parseInt(val)) {
        case 1:
          res = '上架'
          break
        case 2:
          res = '下架'
          break
      }
    }
    return res
  },

  /**
   * 过滤物流收费类型
   */
  filterLogisticsType (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '现付'
        break
      case 1:
        res = '包邮'
        break
      case 2:
        res = '到付'
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
   * 过滤应用端
   */
  filterAppType (val) {
    if (!val) return emptyTips
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
   * 过滤订单类型
   */
  filterOrderType (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '自营'
        break
      case 2:
        res = '代销'
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
   * 过滤商品状态
   */
  filterGoodsStatus (val) {
    if (!val && parseInt(val) !== 0) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 0:
        res = '正常状态'
        break
      case 1:
        res = '待退款'
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
   * 过滤发货状态
   */
  filterSendType (val) {
    if (!val) return emptyTips
    let res = ''
    switch (parseInt(val)) {
      case 1:
        res = '未发货'
        break
      case 2:
        res = '已发货'
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
   * 隐藏手机号中间4位
   */
  filterPhone (val) {
    if (!val) return emptyTips
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
      return val
    }
  },

  /**
   * 时间过滤器
   */
  filterDate (value, type) {
    if (!value) return emptyTips
    let filterType = type || 'YYYY-MM-DD HH:mm:ss'
    return dateFns.format(value, filterType)
  },

  /**
   * 校验是否为空
   */
  filterEmpty (value, unit = '') {
    if (!value && parseInt(value) !== 0) return emptyTips
    return value + unit
  }
}
