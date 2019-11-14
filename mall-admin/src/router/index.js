import Vue from 'vue'
import Router from 'vue-router'
import Component from './Component.js'
import Console from './Console.js'
import Goods from './Goods.js'
// import Column from './Column.js'
import Order from './Order.js'
// import Marketing from './Marketing.js'
// import Vip from './Vip.js'
// import AfterSale from './AfterSale.js'
// import Adverti from './Adverti.js'
import Logistics from './Logistics.js'
import Finance from './Finance.js'
// import Setmeal from './Setmeal.js'
import Seting from './Seting.js'

import {global} from '../../config/utils'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  // base: '/shopadmin/',
  linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    if (!to.path.match(/admin\/console/gi)) {
      let dom = document.getElementsByClassName('admin-child-main')[0]
      if (dom) dom.scrollTop = 0
    }
  },
  routes: [
    // 登录
    {
      path: '/',
      redirect: '/admin'
    },

    // 后台
    {
      path: '/admin',
      redirect: '/admin/console',
      name: 'Admin',
      component: r => require(['@/components/admin/Layout'], r),
      children: [

        // 基础模板
        Component,

        // 控制台
        Console,

        // 商品
        Goods,

        // 栏目
        // Column,

        // 订单
        Order,

        // 营销
        // Marketing,

        // 会员
        // Vip,

        // 售后
        // AfterSale,

        // 广告位
        // Adverti,

        // 物流
        Logistics,

        // 财务
        Finance,

        // 套餐
        // Setmeal,

        // 设置
        Seting
      ]
    },

    {
      path: '/login',
      meta: {
        title: '登录'
      },
      component: r => require(['@/views/admin/Login'], r)
    },

    {
      path: '/css',
      meta: {
        title: 'css伪元素'
      },
      component: r => require(['@/views/Css'], r)
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title

  // 权限验证
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
