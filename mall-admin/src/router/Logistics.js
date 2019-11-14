export default {
  path: '/admin/logistics',
  redirect: '/admin/logistics/seting',
  meta: {
    nav: '物流',
    icon: 'icon-wuliukuaidi',
    auth: true,
    authCode: 401040
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    {
      path: '/admin/logistics/seting',
      redirect: '/admin/logistics/seting/index',
      meta: {
        nav: '物流管理',
        icon: 'icon-cangkucangchu-xianxing',
        auth: true,
        authCode: 401041,
        breadcrumb: [
          { title: '首页', path: '' }
        ]
      },
      component: r => require(['@/views/admin/logistics/IndexLayout'], r),
      children: [
        // ----------- 物流管理
        {
          path: '/admin/logistics/seting/index',
          meta: {
            title: '物流管理',
            pageBack: true,
            // refresh: false,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '物流', path: '/admin/logistics' },
              { title: '物流管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/logistics/Index'], r)
        },

        {
          path: '/admin/logistics/seting/add',
          meta: {
            title: '物流管理',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '物流', path: '/admin/logistics' },
              { title: '物流管理', path: '/admin/logistics/seting' },
              { title: '添加物流', path: '' }
            ]
          },
          component: r => require(['@/views/admin/logistics/SetingPublic'], r)
        },

        {
          path: '/admin/logistics/seting/edit',
          meta: {
            title: '物流管理',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '物流', path: '/admin/logistics' },
              { title: '物流管理', path: '/admin/logistics/seting' },
              { title: '编辑物流', path: '' }
            ]
          },
          component: r => require(['@/views/admin/logistics/SetingPublic'], r)
        }
      ]
    }
  ]
}
