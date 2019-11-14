export default {
  path: '/admin/console',
  redirect: '/admin/console/index',
  meta: {
    nav: '控制台',
    icon: 'icon-msnui-sys-set',
    auth: true,
    authCode: 401010
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 首页
    {
      path: '/admin/console/index',
      meta: {
        title: '控制台',
        nav: '首页',
        icon: 'icon-shouye',
        auth: true,
        authCode: 401011,
        breadcrumb: [
          { title: '控制台', path: '/admin/console' },
          { title: '首页', path: '' }
        ]
      },
      component: r => require(['@/views/admin/console/Index'], r)
    }
  ]
}
