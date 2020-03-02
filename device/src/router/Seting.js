export default {
  path: '/admin/seting',
  redirect: '/admin/seting/account',
  meta: {
    nav: 'menu.setting',
    auth: true,
    menuCode: '101050',
    authId: 1
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    // 账户设置
    {
      path: '/admin/seting/account',
      redirect: '/admin/seting/account/index',
      meta: {
        title: '设置',
        nav: 'menu.accountSetting',
        icon: 'seting-icon1',
        auth: true,
        authId: 7,
        menuCode: '101051'
      },
      component: r => require(['@/views/admin/seting/AccountLayout'], r),
      children: [
        {
          path: '/admin/seting/account/index',
          meta: {
            title: '账户设置',
            auth: true,
            breadcrumb: [
              { title: 'menu.console', path: '/admin/seting/account' },
              { title: 'common.accountManage', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AccountIndex'], r)
        },
        {
          path: '/admin/seting/account/update',
          meta: {
            title: '修改密码',
            auth: true,
            breadcrumb: [
              { title: 'menu.console', path: '/admin/seting/account' },
              { title: 'common.updatePassword', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AccountUpdate'], r)
        }
      ]
    },

    // 权限设置
    {
      path: '/admin/seting/auth',
      redirect: '/admin/seting/auth/admin/index',
      meta: {
        title: '权限设置',
        nav: 'menu.authSetting',
        icon: 'seting-icon2',
        auth: true,
        authId: 7,
        menuCode: '101052'
      },
      component: r => require(['@/views/admin/seting/AuthLayout'], r),
      children: [
        {
          path: '/admin/seting/auth/admin/index',
          meta: {
            title: '管理员',
            auth: true,
            breadcrumb: [
              { title: 'menu.console', path: '/admin/seting/auth' },
              { title: 'device.apartmentManager', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthAdmin'], r)
        },
        {
          path: '/admin/seting/auth/admin/add',
          meta: {
            title: '添加管理员',
            auth: true,
            breadcrumb: [
              { title: 'menu.console', path: '/admin/seting/auth' },
              { title: 'common.addApartmentManager', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthAdminAdd'], r)
        },
        // 编辑管理员
        {
          path: '/admin/seting/auth/admin/edit',
          meta: {
            title: '添加管理员',
            auth: true,
            breadcrumb: [
              { title: 'menu.console', path: '/admin/seting/auth' },
              { title: 'common.updateApartmentManager', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthAdminAdd'], r)
        },
        {
          path: '/admin/seting/auth/group/index',
          meta: {
            title: '权限组',
            auth: true,
            breadcrumb: [
              { title: 'menu.console', path: '/admin/seting/auth' },
              { title: 'account.permissionGroup', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthGroup'], r)
        },
        {
          path: '/admin/seting/auth/group/add',
          meta: {
            title: '添加权限组',
            auth: true,
            breadcrumb: [
              { title: 'menu.console', path: '/admin/seting/auth' },
              { title: 'common.addPermissionGroup', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthGroupAdd'], r)
        },
        // 编辑权限组
        {
          path: '/admin/seting/auth/group/edit',
          meta: {
            title: '添加权限组',
            auth: true,
            breadcrumb: [
              { title: 'menu.console', path: '/admin/seting/auth' },
              { title: 'common.updatePermissionGroup', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthGroupAdd'], r)
        }
      ]
    }

    // 代理商授权
    // {
    //   path: '/admin/seting/authorization',
    //   redirect: '/admin/seting/authorization/all',
    //   meta: {
    //     title: '渠道商授权',
    //     nav: '渠道商授权',
    //     icon: 'seting-icon3',
    //     auth: true,
    //     authId: 7,
    //     menuCode: '201023'
    //   },
    //   component: r => require(['@/views/admin/seting/AuthorizationLayout'], r),
    //   children: [
    //     {
    //       path: '/admin/seting/authorization/all',
    //       meta: {
    //         title: '渠道商授权',
    //         auth: true,
    //         breadcrumb: [
    //           { title: '控制台', path: '/admin/seting/authorization' },
    //           { title: '渠道商授权', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/seting/AuthorizationPublic'], r)
    //     },
    //     {
    //       path: '/admin/seting/authorization/not',
    //       meta: {
    //         title: '待授权',
    //         auth: true,
    //         breadcrumb: [
    //           { title: '控制台', path: '/admin/seting/auth' },
    //           { title: '待授权', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/seting/AuthorizationPublic'], r)
    //     },
    //     {
    //       path: '/admin/seting/authorization/pass',
    //       meta: {
    //         title: '已授权',
    //         auth: true,
    //         breadcrumb: [
    //           { title: '控制台', path: '/admin/seting/auth' },
    //           { title: '已授权', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/seting/AuthorizationPublic'], r)
    //     },
    //     // 授权详情
    //     {
    //       path: '/admin/seting/authorization/detail',
    //       meta: {
    //         title: '已授权',
    //         auth: true,
    //         breadcrumb: [
    //           { title: '控制台', path: '/admin/seting/auth' },
    //           { title: '已授权', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/seting/AuthorizationPublicDetail'], r)
    //     }
    //   ]
    // }
  ]
}
