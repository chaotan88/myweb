export default {
  path: '/admin/business',
  redirect: '/admin/business/rule',
  meta: {
    nav: '业务管理',
    icon: 'icon-fenxiao2',
    auth: true,
    authCode: 601020
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 套餐管理
    {
      path: '/admin/business/package',
      redirect: '/admin/business/package/list',
      meta: {
        nav: '套餐管理',
        icon: 'icon-rule',
        auth: true,
        authCode: 601021
      },
      component: r => require(['@/views/admin/business/BusinessLayout'], r),
      children: [

        // 套餐管理
        {
          path: '/admin/business/package/list',
          meta: {
            title: '套餐管理',
            pageBack: true,
            auth: true,
            authCode: 601021,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '业务管理', path: '/admin/business' },
              { title: '套餐管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/business/PackageList'], r)
        },

        // 创建规则
        {
          path: '/admin/business/package/add',
          meta: {
            title: '创建规则',
            auth: true,
            authCode: 601021,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '业务管理', path: '/admin/business' },
              { title: '创建规则', path: '' }
            ]
          },
          component: r => require(['@/views/admin/business/packagePublic'], r)
        },

        // 编辑规则
        {
          path: '/admin/business/package/edit',
          meta: {
            title: '编辑规则',
            auth: true,
            authCode: 601021,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '业务管理', path: '/admin/business' },
              { title: '编辑规则', path: '' }
            ]
          },
          component: r => require(['@/views/admin/business/packagePublic'], r)
        }
      ]
    },

    // 代金券管理
    {
      path: '/admin/business/voucher',
      redirect: '/admin/business/voucher/index',
      meta: {
        nav: '代金券管理',
        icon: 'icon-rule',
        auth: true,
        authCode: 601021
      },
      component: r => require(['@/views/admin/business/VoucherLayout'], r),
      children: [

        // 代金券管理
        {
          path: '/admin/business/voucher/index',
          meta: {
            title: '代金券管理',
            pageBack: true,
            auth: true,
            authCode: 601021,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '业务管理', path: '/admin/business' },
              { title: '代金券管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/business/Voucher'], r)
        }
      ]
    }
  ]
}
