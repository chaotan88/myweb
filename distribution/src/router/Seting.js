export default {
  path: '/admin/seting',
  redirect: '/admin/seting/basics',
  meta: {
    nav: '设置',
    icon: 'icon-changyonggongju2',
    auth: true,
    authCode: 601080
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 账户设置
    {
      path: '/admin/seting/account',
      redirect: '/admin/seting/account/index',
      meta: {
        nav: '账户设置',
        icon: 'icon-zhanghuziliao',
        auth: true,
        authCode: 601081
      },
      component: r => require(['@/views/admin/seting/AccountLayout'], r),
      children: [
        {
          path: '/admin/seting/account/index',
          meta: {
            title: '账户设置',
            auth: true,
            authCode: 601081,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '账户设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AccountIndex'], r)
        },
        {
          path: '/admin/seting/account/password',
          meta: {
            title: '账户安全',
            auth: true,
            authCode: 601081,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '账户设置', path: '/admin/seting/account/index' },
              { title: '账户安全', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AccountPassword'], r)
        }
      ]
    },

    // 管理员
    {
      path: '/admin/seting/auth',
      redirect: '/admin/seting/auth/admin',
      meta: {
        nav: '管理员',
        icon: 'icon-proj-user',
        auth: true,
        authCode: 601082
      },
      component: r => require(['@/views/admin/seting/AuthLayout'], r),
      children: [
        // 管理员
        {
          path: '/admin/seting/auth/admin',
          meta: {
            title: '管理员',
            auth: true,
            authCode: 601082,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '管理员', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthAdmin'], r)
        },
        {
          path: '/admin/seting/auth/admin/add',
          meta: {
            title: '',
            auth: true,
            authCode: 601082,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '管理员', path: '/admin/seting/auth' },
              { title: '账户列表', path: '/admin/seting/auth/admin' },
              { title: '新增用户', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthAdminPublic'], r)
        },
        {
          path: '/admin/seting/auth/admin/edit',
          meta: {
            title: '',
            auth: true,
            authCode: 601082,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '管理员', path: '/admin/seting/auth' },
              { title: '账户列表', path: '/admin/seting/auth/admin' },
              { title: '修改用户', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthAdminPublic'], r)
        },

        // 权限组
        {
          path: '/admin/seting/auth/group',
          meta: {
            title: '账户列表',
            auth: true,
            authCode: 601082,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '管理员', path: '/admin/seting/group' },
              { title: '权限组', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthGroup'], r)
        },
        {
          path: '/admin/seting/auth/group/add',
          meta: {
            title: '',
            auth: true,
            authCode: 601082,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '管理员', path: '/admin/seting/auth' },
              { title: '权限组', path: '/admin/seting/auth/group' },
              { title: '新增权限组', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthGroupPublic'], r)
        },
        {
          path: '/admin/seting/auth/group/edit',
          meta: {
            title: '',
            auth: true,
            authCode: 601082,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '管理员', path: '/admin/seting/auth' },
              { title: '权限组', path: '/admin/seting/auth/group' },
              { title: '编辑权限组', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthGroupPublic'], r)
        }
      ]
    }
  ]
}
