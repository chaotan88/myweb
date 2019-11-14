export default {
  path: '/admin/column',
  redirect: '/admin/column/manage',
  meta: {
    nav: '栏目',
    icon: 'icon-lanmu',
    auth: true,
    authCode: 401030
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    {
      path: '/admin/column/manage',
      redirect: '/admin/column/manage/index',
      meta: {
        title: '栏目管理',
        nav: '栏目管理',
        icon: 'icon-setting',
        auth: true,
        authCode: 401031
      },
      component: r => require(['@/views/admin/column/ManageLayout'], r),
      children: [
        // -----------------------栏目首页
        {
          path: '/admin/column/manage/index',
          meta: {
            title: '栏目管理',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '栏目', path: '/admin/column' },
              { title: '栏目管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/column/ManageList'], r)
        },

        // --------------------- 添加栏目
        {
          path: '/admin/column/manage/add',
          meta: {
            title: '栏目新增',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '栏目', path: '/admin/column' },
              { title: '栏目管理', path: '/admin/column/manage' },
              { title: '添加栏目', path: '' }
            ]
          },
          component: r => require(['@/views/admin/column/ManagePublic'], r)
        },

        // --------------------- 编辑栏目
        {
          path: '/admin/column/manage/edit',
          meta: {
            title: '编辑栏目',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '栏目', path: '/admin/column' },
              { title: '栏目管理', path: '/admin/column/manage' },
              { title: '编辑栏目', path: '' }
            ]
          },
          component: r => require(['@/views/admin/column/ManagePublic'], r)
        }
      ]
    }
  ]
}

