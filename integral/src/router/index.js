import Vue from 'vue'
import Router from 'vue-router'
import Setup from './Setup'
import User from './User'
import putForward from './putForward'
import pay from './pay'
import recharge from './recharge'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  mode: 'history',
  base: '/points/',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/home',
      component: r => require(['views/index/index'], r),
      meta: {
        title: '积分管理系统',
        IsLogin: true
      }
    },

    {
      path: '/home',
      component: r => require(['views/index/index'], r),
      meta: {
        title: '积分管理系统',
        IsLogin: true
      }
    },

    {
      path: '/login',
      meta: {
        title: '积分管理系统'
      },
      component: r => require(['views/login'], r)
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

    // 个人中心
    User,

    // 提现
    putForward,

    // 设置
    Setup,

    // 支付
    pay,

    // 预付充值
    recharge,

    {
      path: '/partneRules',
      name: 'partneRules',
      meta: {
        title: '合伙人规则'
      },
      component: r => require(['views/partneRules/partneRules'], r)
    },
    {
      path: '/partnerUpgrad',
      name: 'partnerUpgrad',
      meta: {
        title: '区域加盟'
      },
      component: r => require(['views/partnerUpgrad/partnerUpgrad'], r)
    },
    {
      path: '/myAppliy',
      name: 'myAppliy',
      meta: {
        title: '我的申请'
      },
      component: r => require(['views/myAppliy/myAppliy'], r)
    },
    {
      path: '/myAppliyDetail',
      name: 'myAppliyDetail',
      meta: {
        title: '申请详情'
      },
      component: r => require(['views/myAppliyDetail/myAppliyDetail'], r)
    },
    {
      path: '/partnerRecommended',
      name: 'partnerRecommended',
      meta: {
        title: '推荐合伙人'
      },
      component: r => require(['views/partnerRecommended/partnerRecommended'], r)
    },
    {
      path: '/incomeCalculator',
      name: 'incomeCalculator',
      meta: {
        title: '收益计算器'
      },
      component: r => require(['views/incomeCalculator/incomeCalculator'], r)
    },
    {
      path: '/myEarning',
      name: 'myEarning',
      meta: {
        title: '我的收益'
      },
      component: r => require(['views/myEarning/myEarning'], r)
    },
    {
      path: '/earningTable',
      name: 'earningTable',
      meta: {
        title: '收益报表'
      },
      component: r => require(['views/earningTable/index'], r)
    },
    {
      path: '/myRecommend',
      name: 'myRecommend',
      meta: {
        title: '我的推荐'
      },
      component: r => require(['views/myRecommend/myRecommend'], r)
    },
    {
      path: '/infoList',
      name: 'infoList',
      meta: {
        title: '消息列表'
      },
      component: r => require(['views/infoList/infoList'], r)
    },
    {
      path: '/recharge',
      name: 'recharge',
      meta: {
        title: '预付充值'
      },
      component: r => require(['views/recharge/recharge'], r)
    },
    {
      path: '/bankPay',
      name: 'bankPay',
      meta: {
        title: '银行卡支付'
      },
      component: r => require(['views/bankPay/bankPay'], r)
    },
    {
      path: '/bankPayInfo',
      name: 'bankPay',
      meta: {
        title: '银行卡支付'
      },
      component: r => require(['views/bankPayInfo/bankPayInfo'], r)
    },
    {
      path: '/bankPriceRange',
      name: 'bankPriceRange',
      meta: {
        title: '预付升级'
      },
      component: r => require(['views/bankPriceRange/bankPriceRange'], r)
    },
    {
      path: '/bankAgreement',
      name: 'bankAgreement',
      meta: {
        title: '充值条款'
      },
      component: r => require(['views/bankAgreement/bankAgreement'], r)
    },
    {
      path: '/bankGivingPoints',
      name: 'bankGivingPoints',
      meta: {
        title: '转赠'
      },
      component: r => require(['views/bankGivingPoints/bankGivingPoints'], r)
    },
    {
      path: '/bankGivingOk',
      name: 'bankGivingOk',
      meta: {
        title: '转赠成功'
      },
      component: r => require(['views/bankGivingOk/bankGivingOk'], r)
    },
    {
      path: '/bankRechargedSuccess',
      name: 'bankRechargedSuccess',
      meta: {
        title: '充值成功'
      },
      component: r => require(['views/bankRechargedSuccess/bankRechargedSuccess'], r)
    },
    {
      path: '/offlineSuccess',
      name: 'offlineSuccess',
      meta: {
        title: '充值成功'
      },
      component: r => require(['views/offlineSuccess/offlineSuccess'], r)
    },
    {
      path: '/addAlipay',
      name: 'addAlipay',
      meta: {
        title: '添加支付宝'
      },
      component: r => require(['views/addAlipay/addAlipay'], r)
    },
    {
      path: '/addPayChoose',
      name: 'addPayChoose',
      meta: {
        title: '提现选择'
      },
      component: r => require(['views/addPayChoose/addPayChoose'], r)
    }
  ]
})
// function UrlSearch () {
//   var name, value
//   var str = location.href
//   var num = str.indexOf('?')
//   str = str.substr(num + 1)

//   var arr = str.split('&')
//   for (var i = 0; i < arr.length; i++) {
//     num = arr[i].indexOf('=')
//     if (num > 0) {
//       name = arr[i].substring(0, num)
//       value = arr[i].substr(num + 1)
//       this[name] = value
//     }
//   }
// }
// var Request = new UrlSearch()
// var fromType = Request.fromType
// var phone = Request.phone
// var token = Request.token
// console.log('location.href', location.href)

router.beforeEach((to, from, next) => {
  // if (to.meta.title) document.title = to.meta.title

  // 存储历史数据(最多3条，用于判断页面是否相同)
  let historyRoute = JSON.parse(localStorage.getItem('integralHistoryRouter')) || []
  historyRoute.push({
    path: to.path,
    query: to.query
  })
  if (historyRoute.length > 3) historyRoute.shift()
  localStorage.setItem('integralHistoryRouter', JSON.stringify(historyRoute))

  // // 存储不同的历史数据(最多2条，用于返回操作)
  // let prevRoute = JSON.parse(localStorage.getItem('integralPrevRouter')) || []
  // if (prevRoute.length === 2 && prevRoute[1].path !== to.path) prevRoute.shift()
  // if (!prevRoute.length || prevRoute[prevRoute.length - 1].path !== to.path) {
  //   prevRoute.push({
  //     path: to.path,
  //     query: to.query
  //   })
  // }
  // localStorage.setItem('integralPrevRouter', JSON.stringify(prevRoute))

  if (to.meta.IsLogin) { // 判断该路由是否需要登录权限
    var integralUserInfo = JSON.parse(localStorage.getItem('integralUserInfo'))
    if (!integralUserInfo) { // 通过localStorage获取当前的token是否存在
      if (router.currentRoute.fullPath.indexOf('redirect') === -1) {
        // pageUrl商城跳转过来的标志
        router.push({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      } else {
        router.push({
          path: router.currentRoute.fullPath
        })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})
// 导出路由
export default router
