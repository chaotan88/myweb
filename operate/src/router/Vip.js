export default {
  path: '/admin/vip',
  redirect: '/admin/vip/center',
  meta: {
    nav: '会员管理',
    icon: 'icon-huiyuan',
    auth: true,
    authCode: 501050
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 会员首页
    {
      path: '/admin/vip/center',
      redirect: '/admin/vip/center/index',
      meta: {
        nav: '会员中心',
        icon: 'icon-kehuhuiyuanguanli',
        auth: true,
        authCode: 501051
      },
      component: r => require(['@/views/admin/vip/IndexLayout'], r),
      children: [

        // 会员首页
        {
          path: '/admin/vip/center/index',
          meta: {
            title: '会员管理',
            auth: true,
            authCode: 501051,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '会员管理', path: '/admin/vip/' },
              { title: '会员列表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/Index'], r)
        },

        // 会员详情
        {
          path: '/admin/vip/center/details',
          meta: {
            title: '会员详情',
            auth: true,
            authCode: 501051,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '会员管理', path: '/admin/vip/' },
              { title: '会员列表', path: '/admin/vip/center/index' },
              { title: '会员详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/Details'], r)
        }
      ]
    }
  ]
}
