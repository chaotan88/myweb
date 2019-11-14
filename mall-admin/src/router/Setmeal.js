export default {
  path: '/admin/setmeal',
  redirect: '/admin/setmeal/manage',
  meta: {
    nav: '套餐',
    icon: 'icon-taocan',
    // visible: false,
    auth: true,
    authCode: 401010
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 套餐管理
    {
      path: '/admin/setmeal/manage',
      redirect: '/admin/setmeal/manage/list',
      meta: {
        nav: '套餐管理',
        icon: 'icon-taocanguanli',
        auth: true,
        authCode: 401011
      },
      component: r => require(['@/views/admin/setmeal/ManageLayout'], r),
      children: [
        {
          path: '/admin/setmeal/manage/list',
          meta: {
            title: '套餐',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '套餐', path: '/admin/setmeal' },
              { title: '套餐管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/setmeal/ManageList'], r)
        },

        {
          path: '/admin/setmeal/manage/add',
          meta: {
            title: '新增套餐',
            thirdMenu: false,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '套餐', path: '/admin/setmeal' },
              { title: '套餐管理', path: '/admin/setmeal/manage' },
              { title: '新增套餐', path: '' }
            ]
          },
          component: r => require(['@/views/admin/setmeal/ManagePublic'], r)
        },

        {
          path: '/admin/setmeal/manage/edit',
          meta: {
            title: '编辑套餐',
            thirdMenu: false,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '套餐', path: '/admin/setmeal' },
              { title: '套餐管理', path: '/admin/setmeal/manage' },
              { title: '编辑套餐', path: '' }
            ]
          },
          component: r => require(['@/views/admin/setmeal/ManagePublic'], r)
        },

        {
          path: '/admin/setmeal/manage/rule',
          meta: {
            title: '套餐规则设置',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '套餐', path: '/admin/setmeal' },
              { title: '套餐管理', path: '/admin/setmeal/manage' },
              { title: '套餐规则设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/setmeal/RuleSet'], r)
        }
      ]
    }
  ]
}
