import Vue from 'vue'
import Router from 'vue-router'
// import Console from './Console'
import Seting from './Seting'
import Device from './Device'
import Recharge from './Recharge'
import OprateLog from './OprateLog'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  routes: [
    // 1.入口
    {
      path: '/',
      redirect: '/login'
    },

    // 2.登录
    {
      path: '/login',
      component: r => require(['@/views/admin/Login'], r)
    },
    // 2.激活
    {
      path: '/register',
      component: r => require(['@/views/admin/Login'], r)
    },
    // 3.重设密码
    {
      path: '/forget',
      component: r => require(['@/views/admin/Forget'], r)
    },
    // 3.重发邮件
    {
      path: '/almostThere',
      component: r => require(['@/views/admin/AlmostThere'], r)
    },
    // 4.厂商管理员后台
    {
      path: '/admin',
      redirect: '/admin/console',
      component: r => require(['@/components/admin/Layout'], r),
      children: [
        // 控制台模块
        // Console,

        // 设备模块
        Device,

        // 充值模块
        Recharge,

        // 日志
        OprateLog,

        // 设置模块
        Seting

      ]
    }
  ]
})

/**
 * 路由跳转前操作，[ 根据路由配置判断是否需要校验权限、页面标题设置等 ... ]
 * @param  to: 下一个页面路由信息
 * @param  from: 当前页面路由信息
 * @param  next: 执行页面跳转
 */
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    /**
     * 权限认证
     * 通过localStorage 获取用户信息
     */
    // this.adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
    // if (!this.adminInfo || !this.adminInfo.token) {
    //   router.push('/login')
    //   return false
    // }
  }
  if (to.meta.title) document.title = to.meta.title
  next()
})

// 导出路由
export default router
