import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  mode: 'history',
  base: '/mshop/',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'Index',
      meta: { title: '真芯天下商城', isShowFooter: 1 },
      component: r => require(['views/index/Index'], r)
    },
    // {
    //   path: '/indexn',
    //   name: 'Indexn',
    //   meta: { title: '真芯天下商城', isShowFooter: true },
    //   component: r => require(['views/index/Indexn'], r)
    // },

    {
      path: '/login',
      meta: {
        title: '登录'
      },
      component: r => require(['views/Login'], r)
    },

    {
      path: '/register',
      meta: {
        title: '注册'
      },
      component: r => require(['views/Register'], r)
    },
    {
      path: '/privacyAgreement',
      meta: {
        title: '隐私协议'
      },
      component: r => require(['views/privacyAgreement/privacyAgreement'], r)
    },

    {
      path: '/retrieve-password',
      meta: {
        title: '找回密码'
      },
      component: r => require(['views/RetrievePassword'], r)
    },

    {
      path: '/brandList',
      name: 'brandList',
      meta: { title: '品牌推荐', isShowFooter: false },
      component: r => require(['views/brandList/brandList'], r)
    },
    {
      path: '/brandShop',
      name: 'brandShop',
      meta: { title: '品牌店铺', isShowFooter: false },
      component: r => require(['views/brandShop/brandShop'], r)
    },
    {
      path: '/classification',
      name: 'classification',
      meta: { title: '分类', isShowFooter: 1 },
      component: r => require(['views/classification/classification'], r)
    },
    {
      path: '/shopCart',
      name: 'shopCart',
      meta: { title: '购物车', IsLogin: false, isShowFooter: 1 },
      component: r => require(['views/shopCart/ShopCart'], r)
    },
    {
      path: '/my',
      name: 'my',
      meta: {
        title: '我的',
        auth: true,
        isShowFooter: 1,
        isStoreFooter: true,
        IsLogin: false
      },
      component: r => require(['views/my/My'], r)
    },
    {
      path: '/myWallet',
      name: 'myWallet',
      meta: {
        title: '我的钱包'
      },
      component: r => require(['views/myWallet/myWallet'], r),
      beforeEnter: (to, from, next) => {
        from.path.indexOf('/login') > -1 && to.fullPath.indexOf('isLoginBtn') === -1 ? window.history.go(-1) : next()
      }
    },
    {
      path: '/consumePoints',
      name: 'consumePoints',
      meta: {
        title: '我的积分'
      },
      component: r => require(['views/myWallet/consumePoints'], r),
      beforeEnter: (to, from, next) => {
        from.path.indexOf('/login') > -1 && to.fullPath.indexOf('isLoginBtn') === -1 ? window.history.go(-1) : next()
      }
    },
    {
      path: '/myBalance',
      name: 'myBalance',
      meta: {
        title: '我的余额'
      },
      component: r => require(['views/myWallet/myBalance'], r),
      beforeEnter: (to, from, next) => {
        from.path.indexOf('/login') > -1 && to.fullPath.indexOf('isLoginBtn') === -1 ? window.history.go(-1) : next()
      }
    },
    {
      path: '/myPointsDetail',
      name: 'myPointsDetail',
      meta: {
        title: '我的积分'
      },
      component: r => require(['views/myWallet/myPointsDetail'], r)
    },
    {
      path: '/getGoldCoin',
      name: 'getGoldCoin',
      meta: {
        title: '任务获芯豆'
      },
      component: r => require(['views/myWallet/getGoldCoin'], r)
    },
    {
      path: '/welfarewZone',
      name: 'welfarewZone',
      meta: {
        title: '兑换专区'
      },
      component: r => require(['views/myWallet/welfarewZone'], r)
    },
    {
      path: '/recommendPrize',
      name: 'recommendPrize',
      meta: {
        title: ''
      },
      component: r => require(['views/activity/recommendPrize'], r)
    },
    {
      path: '/sharePurchase',
      name: 'sharePurchase',
      meta: {
        title: '分享购'
      },
      component: r => require(['views/activity/sharePurchase'], r)
    },
    {
      path: '/share/goodDetail',
      name: 'shareGoodDetail',
      meta: {
        title: '分享详情'
      },
      component: r => require(['views/activity/GoodDetail'], r)
    },
    {
      path: '/multiActivityList',
      name: 'multiActivityList',
      meta: {
        title: '多区活动列表'
      },
      component: r => require(['views/activity/multiActivityList'], r)
    },
    {
      path: '/singleActivityList',
      name: 'singleActivityList',
      meta: {
        title: '单区活动列表'
      },
      component: r => require(['views/activity/singleActivityList'], r)
    },
    {
      path: '/partneRules',
      name: 'partneRules',
      meta: {
        title: '合伙人规则'
      },
      component: r => require(['views/partnerPlan/partneRules'], r)
    },
    {
      path: '/partnerPlan',
      name: 'partnerPlan',
      meta: {
        title: '合伙人计划'
      },
      component: r => require(['views/partnerPlan/partnerPlanIndex'], r)
    },
    {
      path: '/partnerUpgrad',
      name: 'partnerUpgrad',
      meta: {
        title: '合伙人升级'
      },
      component: r => require(['views/partnerPlan/partnerUpgrad'], r)
    },
    {
      path: '/partnerSubmission',
      name: 'partnerSubmission',
      meta: {
        title: '提交申请'
      },
      component: r => require(['views/partnerPlan/partnerSubmission'], r)
    },
    {
      path: '/myAppliy',
      name: 'myAppliy',
      meta: {
        title: '我的申请'
      },
      component: r => require(['views/partnerPlan/myAppliy'], r)
    },
    {
      path: '/myAppliyDetail',
      name: 'myAppliyDetail',
      meta: {
        title: '详情'
      },
      component: r => require(['views/partnerPlan/myAppliyDetail'], r)
    },
    {
      path: '/realNameAuth',
      name: 'realNameAuth',
      meta: {
        title: '实名认证'
      },
      component: r => require(['views/realNameAuth/realNameAuth'], r)
    },
    {
      path: '/realNameAuthed',
      name: 'realNameAuthed',
      meta: {
        title: '实名认证(已认证)'
      },
      component: r => require(['views/realNameAuth/realNameAuth'], r)
    },
    {
      path: '/bindInviter',
      name: 'bindInviter',
      meta: {
        title: '绑定邀请人'
      },
      component: r => require(['views/bindInviter/bindInviter'], r)
    },
    {
      path: '/region',
      name: 'region',
      meta: {
        title: '升级'
      },
      component: r => require(['views/region/region'], r)
    },
    {
      path: '/region1',
      name: 'region1',
      meta: {
        title: '地区'
      },
      component: r => require(['views/region/region1'], r)
    },
    {
      path: '/partnerRecommended',
      name: 'partnerRecommended',
      meta: {
        title: '推荐合伙人'
      },
      component: r => require(['views/partnerPlan/partnerRecommended'], r)
    },
    {
      path: '/myEarning',
      name: 'myEarning',
      meta: {
        title: '我的收益'
      },
      component: r => require(['views/partnerPlan/myEarning'], r)
    },
    {
      path: '/incomeCalculator',
      name: 'incomeCalculator',
      meta: {
        title: '收益计算器'
      },
      component: r => require(['views/partnerPlan/incomeCalculator'], r)
    },
    {
      path: '/myRecommend',
      name: 'myRecommend',
      meta: {
        title: '我的推荐'
      },
      component: r => require(['views/partnerPlan/myRecommend'], r)
    },
    {
      path: '/setmeal',
      name: 'setmeal',
      meta: {
        title: '套餐区'
      },
      component: r => require(['views/setmeal/setmeal'], r)
    },
    // {
    //   path: '/setmeal2',
    //   name: 'setmeal2',
    //   meta: {
    //     title: '套餐区'
    //   },
    //   component: r => require(['views/setmeal/setmeal2'], r)
    // },
    {
      path: '/mealAggregate',
      name: 'mealAggregate',
      meta: {
        title: '套餐'
      },
      component: r => require(['views/setmeal/mealAggregate'], r)
    },
    {
      path: '/optionalMeal',
      name: 'optionalMeal',
      meta: {
        title: '自选套餐'
      },
      component: r => require(['views/setmeal/optionalMeal'], r)
    },
    {
      path: '/fixedMeal',
      name: 'fixedMeal',
      meta: {
        title: '固定套餐'
      },
      component: r => require(['views/setmeal/fixedMeal'], r)
    },
    {
      path: '/makerPlan',
      name: 'makerPlan',
      meta: {
        title: '创客计划',
        auth: true
      },
      component: r => require(['views/makerPlan/makerPlan'], r),
      beforeEnter: (to, from, next) => {
        from.path.indexOf('/login') > -1 && to.fullPath.indexOf('isLoginBtn') === -1 ? window.history.go(-1) : next()
      }
    },
    {
      path: '/integral',
      name: 'integral',
      meta: {
        title: '积分记录',
        auth: true
      },
      component: r => require(['views/integral/integral'], r)
    },
    {
      path: '/freeShop',
      name: 'freeShop',
      meta: {
        title: '免费开店',
        auth: true
      },
      component: r => require(['views/freeShop/freeShop'], r)
    },
    {
      path: '/storeAudit',
      name: 'storeAudit',
      meta: {
        title: '开店审核',
        auth: true
      },
      component: r => require(['views/storeAudit/storeAudit'], r)
    },
    {
      path: '/serch',
      name: 'serch',
      meta: {
        title: '搜索',
        auth: true
      },
      component: r => require(['views/serch/serch'], r)
    },
    {
      path: '/goodList',
      name: 'goodList',
      meta: { title: '商品列表', isShowFooter: 1 },
      component: r => require(['views/goodList/goodList'], r)
    },
    {
      path: '/goodDetail',
      name: 'goodDetail',
      meta: { title: '商品详情', noGoLogin: true },
      component: r => require(['views/goodDetail/goodDetail'], r)
    },
    {
      path: '/confirmOrder',
      name: 'confirmOrder',
      meta: { title: '确认订单' },
      component: r => require(['views/confirmOrder/ConfirmOrder'], r)
    },
    {
      path: '/personalInfor',
      name: 'personalInfor',
      meta: { title: '个人资料' },
      component: r => require(['views/personalInfor/PersonalInfor'], r)
    },
    {
      path: '/receiveAddr',
      name: 'receiveAddr',
      meta: { title: '收货地址列表' },
      component: r => require(['views/goodAddr/ReceiveAddr'], r),
      beforeEnter: (to, from, next) => {
        from.path.indexOf('/login') > -1 && to.fullPath.indexOf('isLoginBtn') === -1 ? window.history.go(-1) : next()
      }
    },
    {
      path: '/addReceiveAddr',
      name: 'addReceiveAddr',
      meta: { title: '添加收货地址' },
      component: r => require(['views/goodAddr/AddReceiveAddr'], r)
    },
    {
      path: '/editReceiveAddr',
      name: 'editReceiveAddr',
      meta: { title: '编辑收货地址' },
      component: r => require(['views/goodAddr/AddReceiveAddr'], r)
    },
    {
      path: '/myCollect',
      name: 'myCollect',
      meta: { title: '我的收藏' },
      component: r => require(['views/myCollect/MyCollect'], r),
      beforeEnter: (to, from, next) => {
        from.path.indexOf('/login') > -1 && to.fullPath.indexOf('isLoginBtn') === -1 ? window.history.go(-1) : next()
      }
    },
    {
      path: '/orderList',
      name: 'orderList',
      meta: { title: '我的订单' },
      component: r => require(['views/orderList/OrderList'], r),
      beforeEnter: (to, from, next) => {
        from.path.indexOf('/login') > -1 && to.fullPath.indexOf('isLoginBtn') === -1 ? window.history.go(-1) : next()
      }
    },
    {
      path: '/viewLogistics',
      name: 'viewLogistics',
      meta: { title: '查看物流' },
      component: r => require(['views/orderList/viewLogistics'], r)
    },
    {
      path: '/waitPayOrder',
      name: 'waitPayOrder',
      meta: { title: '待付款订单' },
      component: r => require(['views/orderList/OrderList'], r)
    },
    {
      path: '/waitDeliveryOrder',
      name: 'waitDeliveryOrder',
      meta: { title: '待发货订单' },
      component: r => require(['views/orderList/OrderList'], r)
    },
    {
      path: '/waitTakeOrder',
      name: 'waitTakeOrder',
      meta: { title: '待收货订单' },
      component: r => require(['views/orderList/OrderList'], r)
    },
    {
      path: '/waitCommentsOrder',
      name: 'waitCommentsOrder',
      meta: { title: '待评价订单' },
      component: r => require(['views/orderList/OrderList'], r)
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      meta: { title: '订单详情' },
      component: r => require(['views/orderList/OrderDetail'], r)
    },
    {
      path: '/pay/orderPay',
      name: 'pay',
      meta: { title: '支付' },
      component: r => require(['views/pay/Pay'], r)
    },
    {
      path: '/paySuccess',
      name: 'paySuccess',
      meta: { title: '支付成功', isShowFooter: 1 },
      component: r => require(['views/paySuccess/paySuccess'], r)
    },
    {
      path: '/partnerPaySuccess',
      name: 'partnerPaySuccess',
      meta: { title: '支付成功', isShowFooter: 1 },
      component: r => require(['views/paySuccess/partnerPaySuccess'], r)
    },
    {
      path: '/offlinePay',
      name: 'offlinePay',
      meta: { title: '支付订单', isShowFooter: false },
      component: r => require(['views/offlinePay/offlinePay'], r)
    },
    {
      path: '/verifyingPhone',
      name: 'verifyingPhone',
      meta: { title: '支付订单', isShowFooter: false },
      component: r => require(['views/verifyingPhone/verifyingPhone'], r)
    },
    {
      path: '/setPassword',
      name: 'setPassword',
      meta: { title: '支付订单', isShowFooter: false },
      component: r => require(['views/setPassword/setPassword'], r)
    },
    {
      path: '/commentsOrder',
      name: 'commentsOrder',
      meta: { title: '评价订单' },
      component: r => require(['views/commentsOrder/CommentsOrder'], r)
    },
    {
      path: '/refundAndsalesafter',
      name: 'refundAndsalesafter',
      meta: { title: '退款/售后' },
      component: r => require(['views/refundAndsalesafter/Index'], r)
    },
    {
      path: '/applyRefundMoney',
      name: 'applyRefundMoney',
      meta: { title: '申请退款列表' },
      component: r => require(['views/refundAndsalesafter/applyRefundMoney'], r)
    },
    {
      path: '/applyRefundMoneySubmit',
      name: 'applyRefundMoneySubmit',
      meta: { title: '申请退款' },
      component: r => require(['views/refundAndsalesafter/applyRefundMoneySubmit'], r)
    },
    {
      path: '/applyRefundGood',
      name: 'applyRefundGood',
      meta: { title: '已经申请完退款列表' },
      component: r => require(['views/refundAndsalesafter/applyRefundGood'], r)
    },
    {
      path: '/applyRefundGoodDetail',
      name: 'applyRefundGoodDetail',
      meta: { title: '已经申请完退款详情' },
      component: r => require(['views/refundAndsalesafter/applyRefundGoodDetail'], r)
    },
    {
      path: '/set',
      name: 'set',
      meta: { title: '设置' },
      component: r => require(['views/set/Set'], r)
    },
    {
      path: '/phone',
      name: 'phone',
      meta: { title: '更换手机号' },
      component: r => require(['views/set/phone'], r)
    },
    {
      path: '/updatePhone',
      name: 'updatePhone',
      meta: { title: '更换手机号' },
      component: r => require(['views/set/updatePhone'], r)
    },
    {
      path: '/password',
      name: 'password',
      meta: { title: '密码设置' },
      component: r => require(['views/set/password'], r)
    },
    {
      path: '/resetPassword',
      name: 'resetPassword',
      meta: { title: '重置登录密码' },
      component: r => require(['views/set/resetPassword'], r)
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录' },
      component: r => require(['views/Login'], r)
    },
    {
      path: '/downLoad',
      name: 'downLoad',
      meta: { title: 'APP下载' },
      component: r => require(['views/downLoad/downLoad'], r)
    },
    {
      path: '/ticketPurchase',
      name: 'ticketPurchase',
      meta: { title: '会场购票' },
      component: r => require(['views/tickets/ticketPurchase'], r),
      beforeEnter: (to, from, next) => {
        from.path.indexOf('/login') > -1 && to.fullPath.indexOf('isLoginBtn') === -1 ? window.history.go(-1) : next()
      }
    },
    {
      path: '/ticketsDetail',
      name: 'ticketsDetail',
      meta: { title: '购票详情' },
      component: r => require(['views/tickets/ticketsDetail'], r)
    },
    {
      path: '/ticketsOrder',
      name: 'ticketsOrder',
      meta: { title: '订单详情' },
      component: r => require(['views/tickets/ticketsOrder'], r)
    },
    {
      path: '/pullGroupTool/pullGroupAssistant',
      name: 'pullGroupAssistant',
      meta: { title: '拉群助手' },
      component: r => require(['views/operate/pullGroupTool/pullGroupAssistant'], r)
    },
    {
      path: '/pullGroupTool/addGroupCard',
      name: 'addGroupCard',
      meta: { title: '新增群名片' },
      component: r => require(['views/operate/pullGroupTool/addGroupCard'], r)
    },
    {
      path: '/Turntable',
      name: 'Turntable',
      meta: { title: '大转盘' },
      component: r => require(['views/turntable/turntable'], r)
    },
    {
      path: '/spliceOrder',
      name: 'spliceOrder',
      meta: { title: '拼团' },
      component: r => require(['views/spliceOrder/spliceOrder'], r)
    },
    {
      path: '/participate',
      name: 'participate',
      meta: { title: '参与拼团' },
      component: r => require(['views/spliceOrder/participate'], r)
    },
    {
      path: '/spliceSuccess',
      name: 'spliceSuccess',
      meta: { title: '拼团成功' },
      component: r => require(['views/spliceOrder/spliceSuccess'], r)
    },
    {
      path: '/shopFlashSale',
      name: 'shopFlashSale',
      meta: { title: '限时特卖' },
      component: r => require(['views/shopFlashSale/shopFlashSale'], r)
    },
    {
      path: '/shopTrace',
      name: 'trace',
      meta: { title: '溯源' },
      component: r => require(['views/shopTrace/shopTrace'], r)
    },
    {
      path: '/shopSellGoods',
      name: 'shopSellGoods',
      meta: { title: '销售我的商品', isStoreFooter: true },
      component: r => require(['views/shopSellGoods/shopSellGoods'], r)
    },
    {
      path: '/shopLuckyStrike',
      name: 'shopLuckyStrike',
      meta: { title: '', isStoreFooter: true },
      component: r => require(['views/shopLuckyStrike/shopLuckyStrike'], r)
    },
    {
      path: '/shopearningsInfo',
      name: 'shopearningsInfo',
      meta: { title: '收益说明' },
      component: r => require(['views/shopearningsInfo/shopearningsInfo'], r)
    },
    {
      path: '/hallSellManagement',
      name: 'hallSellManagement',
      meta: { title: '挂售管理' },
      component: r => require(['views/hallSellManagement/hallSellManagement'], r)
    },
    {
      path: '/groupOffered',
      name: 'groupOffered',
      meta: { title: '参团', isShowFooter: 2 },
      component: r => require(['views/groupOffered/groupOffered'], r)
    },
    {
      path: '/groupTrta',
      name: 'groupTrta',
      meta: { title: '团营', isShowFooter: 2 },
      component: r => require(['views/groupTrta/groupTrta'], r)
    },
    {
      path: '/groupFound',
      name: 'groupFound',
      meta: { title: '芯发现', isShowFooter: 2 },
      component: r => require(['views/groupFound/groupFound'], r)
    },
    {
      path: '/groupFree',
      name: 'groupFree',
      meta: { title: '免费开团' },
      component: r => require(['views/groupFree/groupFree'], r)
    },
    {
      path: '/groupAdd',
      name: 'groupAdd',
      meta: { title: '参与拼团' },
      component: r => require(['views/groupAdd/groupAdd'], r)
    },
    {
      path: '/groupDoing',
      name: 'groupDoing',
      meta: { title: '拼团中' },
      component: r => require(['views/groupDoing/groupDoing'], r)
    },
    {
      path: '/myCoupons',
      name: 'myCoupons',
      meta: { title: '优惠券' },
      component: r => require(['views/my/myCoupons'], r)
    },
    {
      path: '/barterArea',
      name: 'barterArea',
      meta: { title: 'ATT易货区', isShowFooter: 3 },
      component: r => require(['views/barterArea/barterArea'], r)
    },
    {
      path: '/release',
      name: 'release',
      meta: { title: '发布' },
      component: r => require(['views/barterArea/release'], r)
    },
    {
      path: '/tradCenter',
      name: 'tradCenter',
      meta: { title: '交易中心', isShowFooter: 3 },
      component: r => require(['views/barterArea/tradCenter'], r)
    },
    {
      path: '/barterDetails',
      name: 'barterDetails',
      meta: { title: '易货商品详情' },
      component: r => require(['views/barterArea/barterDetails'], r)
    },
    {
      path: '/comtoUpgrade',
      name: 'comtoUpgrade',
      meta: { title: '升级套餐' },
      component: r => require(['views/comtoUpgrade/comtoUpgrade'], r)
    },
    {
      path: '/comtoMerchant',
      name: 'comtoMerchant',
      meta: { title: '商户认证' },
      component: r => require(['views/comtoMerchant/comtoMerchant'], r)
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.IsLogin) {  // 判断该路由是否需要登录权限
    var bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
    if (!bsbUserInfo || !bsbUserInfo.token) {  // 通过localStorage获取当前的token是否存在
      router.push({
        path: '/login',
        query: {redirect: router.currentRoute.fullPath}
      })
      return false
    } else {
      next()
    }
  }
  if (!to.query.shopId && !from.params.shopId) {
    to.query.shopId = localStorage.getItem('shopId') ? localStorage.getItem('shopId') : 1
    router.push({
      path: to.path,
      query: to.query
    })
  } else {
    localStorage.setItem('shopId', to.query.shopId)
    next()
  }
})
// 导出路由
export default router
