export default {
  path: '/admin/supplier',
  redirect: '/admin/supplier/manage',
  meta: {
    nav: '供应商管理',
    icon: 'icon-liuliangyunpingtaitubiao04',
    auth: true,
    authCode: 501070
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 供应商列表
    {
      path: '/admin/supplier/manage',
      redirect: '/admin/supplier/manage/list',
      meta: {
        nav: '供应商列表',
        icon: 'icon-icon-supplier',
        auth: true,
        authCode: 501071
      },
      component: r => require(['@/views/admin/supplier/IndexLayout'], r),
      children: [

        // 供应商管理列表
        {
          path: '/admin/supplier/manage/list',
          meta: {
            title: '供应商列表',
            auth: true,
            authCode: 501071,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '供应商管理', path: '/admin/supplier' },
              { title: '供应商列表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/supplier/ManageList'], r)
        },

        // 添加供应商
        {
          path: '/admin/supplier/manage/add',
          meta: {
            title: '添加供应商',
            auth: true,
            authCode: 501071,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '供应商管理', path: '/admin/supplier' },
              { title: '供应商列表', path: '/admin/supplier/manage' },
              { title: '添加供应商', path: '' }
            ]
          },
          component: r => require(['@/views/admin/supplier/ManagePublic'], r)
        },

        // 添加供应商
        {
          path: '/admin/supplier/manage/edit',
          meta: {
            title: '编辑供应商',
            auth: true,
            authCode: 501071,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '供应商管理', path: '/admin/supplier' },
              { title: '供应商列表', path: '/admin/supplier/manage' },
              { title: '编辑供应商', path: '' }
            ]
          },
          component: r => require(['@/views/admin/supplier/ManagePublic'], r)
        }
      ]
    }
  ]
}
