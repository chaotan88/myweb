export default {
  path: '/admin/log',
  redirect: '/admin/log/index',
  meta: {
    nav: 'menu.logManage',
    auth: true,
    authId: 2,
    menuCode: '101040'
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    {
      path: '/admin/log/visitlog',
      meta: {
        title: '访问日志',
        nav: 'menu.accessLog',
        icon: 'console-icon',
        auth: true,
        authId: 10,
        menuCode: '101041',
        breadcrumb: [
          { title: 'menu.accessLog', path: '' }
        ]
      },
      component: r => require(['@/views/admin/log/VisitLog'], r)
      // children: [
      //   {
      //     path: '',
      //     meta: {
      //       title: '',
      //       auth: true,
      //       breadcrumb: [
      //         { title: '', path: '' },
      //         { title: '', path: '' }
      //       ]
      //     },
      //     component: r => require([''], r)
      //   },
      //   {
      //     path: '',
      //     meta: {
      //       title: '',
      //       auth: true,
      //       breadcrumb: [
      //         { title: '', path: '' }
      //       ]
      //     },
      //     component: r => require([''], r)
      //   }
      // ]
    },
    {
      path: '/admin/log/oprationLog',
      meta: {
        title: '操作日志',
        nav: 'menu.oprateLog',
        icon: 'console-icon',
        auth: true,
        authId: 10,
        menuCode: '101041',
        breadcrumb: [
          { title: 'menu.oprateLog', path: '' }
        ]
      },
      component: r => require(['@/views/admin/log/OprationLog'], r)
    }
  ]
}
