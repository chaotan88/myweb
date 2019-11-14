import Vue from 'vue'
import Router from 'vue-router'
import Console from './Console'             // 控制台
import Goods from './Goods'                 // 商品
import Operation from './Operation'         // 运营
import Supplier from './Supplier'           // 供应商
import Order from './Order'                 // 订单
import Finance from './Finance'             // 财务
import Vip from './Vip'                     // 会员
import Seting from './Seting'               // 设置
import Warehouse from './Warehouse.js'      // 买卖仓
import Merchant from './Merchant.js'  // 商户管理
import {global} from '../../config/utils'   // 全局属性

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    if (!to.path.match(/admin\/console/gi)) {
      let dom = document.getElementsByClassName('admin-child-main')[0]
      if (dom) dom.scrollTop = 0
    }
  },
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: r => require(['@/views/admin/Login'], r)
    },
    {
      path: '/admin',
      redirect: '/admin/console',
      name: 'Admin',
      component: r => require(['@/components/admin/Layout'], r),
      children: [
        // 控制台
        Console,

        // 商品
        Goods,

        // 买卖仓
        Warehouse,

        // 运营管理
        Operation,

        // 订单
        Order,

        // 会员
        Vip,

        // 财务
        Finance,

        // 供应商
        Supplier,

        // 设置
        Seting,

        // 商户管理
        Merchant
      ]
    }
  ]
})

/**
 * 路由匹配前、后的操作
 */
router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title

  // 权限认证判断
  let userInfo = JSON.parse(localStorage.getItem(global.USER_INFO))
  if (to.path.match(/admin/gi) && !userInfo) {
    next({
      path: '/login',
      replace: true
    })
    return false
  }

  // 存储历史数据(最多3条，用于判断页面是否相同)
  let historyRoute = JSON.parse(localStorage.getItem(global.HISTORY_ROUTE)) || []
  historyRoute.push({
    path: to.path,
    query: to.query
  })
  if (historyRoute.length > 3) historyRoute.shift()
  localStorage.setItem(global.HISTORY_ROUTE, JSON.stringify(historyRoute))

  // 存储不同的历史数据(最多2条，用于返回操作)
  let prevRoute = JSON.parse(localStorage.getItem(global.PREV_ROUTE)) || []
  if (prevRoute.length === 2 && prevRoute[1].path !== to.path) prevRoute.shift()
  if (!prevRoute.length || prevRoute[prevRoute.length - 1].path !== to.path) {
    prevRoute.push({
      path: to.path,
      query: to.query
    })
  }
  // 移除上一个页面存储信息，避免重复返回
  localStorage.setItem(global.PREV_ROUTE, JSON.stringify(prevRoute))

  if (!to.query.page && to.meta.page !== false) {
    to.query.page = 1
    next({
      path: to.path,
      query: to.query
    })
  } else {
    next()
  }
})

router.afterEach((to, from, next) => {
  // 如果用户进行返回或前进历史记录操作，移除存储信息
  if (localStorage.getItem(global.POPSTATE)) {
    setTimeout(() => {
      localStorage.removeItem(global.POPSTATE)
    })
  }
})

export default router
