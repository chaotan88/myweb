export default {
  path: '/putForward',
  redirect: '/putForward/index',
  meta: {
    nav: '提现',
    title: '提现'
  },
  component: r => require(['views/user/Layout'], r),
  children: [
    // ------------提现
    {
      path: '/putForward/index',
      meta: {
        nav: '提现',
        title: '提现'
      },
      component: r => require(['views/putForward/Index'], r)
    },

    // ------------提现密码
    {
      path: '/putForward/password',
      meta: {
        nav: '提现密码',
        title: '提现'
      },
      component: r => require(['views/putForward/Password'], r)
    }
  ]
}
