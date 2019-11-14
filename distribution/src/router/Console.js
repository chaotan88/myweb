export default {
  path: '/admin/console',
  redirect: '/admin/console/index',
  meta: {
    nav: '控制台',
    icon: 'icon-msnui-sys-set',
    auth: true,
    authCode: 601010
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
        refresh: false,           // 刷新页面
        auth: true,
        authCode: 601011,
        breadcrumb: [
          { title: '首页', path: '' }
        ]
      },
      component: r => require(['@/views/admin/console/Index'], r)
    }
  ]
}
