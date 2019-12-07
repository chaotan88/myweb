export default {
  path: '/admin/statistics',
  redirect: '/admin/statistics/vip',
  meta: {
    nav: '统计',
    icon: '',
    visible: false,
    auth: true,
    authCode: 601060
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 会员统计
    {
      path: '/admin/statistics',
      redirect: '/admin/statistics/vip/list',
      meta: {
        nav: '会员统计',
        icon: '',
        auth: true,
        authCode: 601041
      },
      component: r => require(['@/views/admin/statistics/VipLayout'], r),
      children: [

        // 会员统计
        {
          path: '/admin/statistics/vip/list',
          meta: {
            title: '会员统计',
            auth: true,
            visible: true,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '会员统计', path: '/admin/statistics' }
            ]
          },
          component: r => require(['@/views/admin/statistics/CountVip'], r)
        }
      ]
    },

    // 销售统计
    {
      path: '/admin/statistics/sale',
      redirect: '/admin/statistics/sale/list',
      meta: {
        nav: '销售统计',
        icon: '',
        auth: true,
        visible: true,
        authCode: 601042
      },
      component: r => require(['@/views/admin/statistics/SoleLayout'], r),
      children: [

        // 销售统计
        {
          path: '/admin/statistics/sale/list',
          meta: {
            title: '销售统计',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '会员统计', path: '/admin/statistics' }
            ]
          },
          component: r => require(['@/views/admin/statistics/CountSale'], r)
        }
      ]
    }
  ]
}
