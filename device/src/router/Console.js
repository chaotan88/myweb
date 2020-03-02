export default {
  path: '/admin/console',
  redirect: '/admin/console/index',
  meta: {
    nav: 'menu.console',
    auth: true,
    authId: 2,
    menuCode: '101010'
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    {
      path: '/admin/console/index',
      meta: {
        title: 'menu.console',
        nav: 'menu.console',
        icon: 'console-icon',
        auth: true,
        authId: 10,
        menuCode: '101011',
        breadcrumb: [
          { title: 'menu.console', path: '' }
        ]
      },
      component: r => require(['@/views/admin/console/Index'], r)
    },
    {
      path: '/admin/console/index2',
      meta: {
        title: '控制台',
        nav: 'menu.console',
        icon: 'console-icon',
        auth: true,
        authId: 10,
        menuCode: '101013',
        breadcrumb: [
          { title: 'menu.console', path: '' }
        ]
      },
      component: r => require(['@/views/admin/console/Console'], r)
    }
  ]
}
