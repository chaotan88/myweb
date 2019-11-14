export default {
  path: '/admin/seting',
  redirect: '/admin/seting/basics',
  meta: {
    nav: '设置',
    icon: 'icon-changyonggongju2',
    auth: true,
    authCode: 401060
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    // 基础设置
    {
      path: '/admin/seting/basics/',
      redirect: '/admin/seting/basics/index',
      meta: {
        nav: '基础设置',
        icon: 'icon-msnui-sys-set',
        auth: true,
        authCode: 401061
      },
      component: r => require(['@/views/admin/seting/IndexLayout'], r),
      children: [
        {
          path: '/admin/seting/basics/index',
          meta: {
            title: '基础设置',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '基础设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/Index'], r)
        },

        // 注册协议
        {
          path: '/admin/seting/basics/agreement',
          meta: {
            title: '注册协议',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '基础设置', path: '/admin/seting/basics/index' },
              { title: '注册协议', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/Agreement'], r)
        },

        // 添加注册协议
        {
          path: '/admin/seting/basics/agreement/add',
          meta: {
            title: '添加注册协议',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '基础设置', path: '/admin/seting/basics/index' },
              { title: '注册协议', path: '/admin/seting/basics/agreement' },
              { title: '添加注册协议', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AgreementPublic'], r)
        },

        // 编辑注册协议
        {
          path: '/admin/seting/basics/agreement/edit',
          meta: {
            title: '编辑注册协议',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '基础设置', path: '/admin/seting/basics/index' },
              { title: '注册协议', path: '/admin/seting/basics/agreement' },
              { title: '添加注册协议', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AgreementPublic'], r)
        }
      ]
    },

    // 账户设置
    {
      path: '/admin/seting/account',
      redirect: '/admin/seting/account/index',
      meta: {
        nav: '账户设置',
        icon: 'icon-zhanghuziliao',
        visible: false,
        auth: true,
        authCode: 401092
      },
      component: r => require(['@/views/admin/seting/AccountLayout'], r),
      children: [
        {
          path: '/admin/seting/account/index',
          meta: {
            title: '账户设置',
            auth: true,
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

    // 账户权限
    {
      path: '/admin/seting/auth',
      redirect: '/admin/seting/auth/admin',
      meta: {
        nav: '账户权限',
        icon: 'icon-moban',
        auth: true,
        authCode: 401062
      },
      component: r => require(['@/views/admin/seting/AuthLayout'], r),
      children: [
        // 账户列表
        {
          path: '/admin/seting/auth/admin',
          meta: {
            title: '账户列表',
            pageBack: true,
            auth: true,
            authCode: 401062,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '账户权限', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthAdmin'], r)
        },
        {
          path: '/admin/seting/auth/admin/add',
          meta: {
            title: '新增用户',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '账户权限', path: '/admin/seting/auth' },
              { title: '账户列表', path: '/admin/seting/auth/admin' },
              { title: '新增用户', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthAdminPublic'], r)
        },
        {
          path: '/admin/seting/auth/admin/edit',
          meta: {
            title: '修改用户',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '账户权限', path: '/admin/seting/auth' },
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
            title: '权限组',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '账户权限', path: '/admin/seting/auth' },
              { title: '权限组', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthGroup'], r)
        },
        {
          path: '/admin/seting/auth/group/add',
          meta: {
            title: '新增权限组',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '账户权限', path: '/admin/seting/auth' },
              { title: '权限组', path: '/admin/seting/auth/group' },
              { title: '新增权限组', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AuthGroupPublic'], r)
        },

        {
          path: '/admin/seting/auth/group/edit',
          meta: {
            title: '编辑权限组',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '账户权限', path: '/admin/seting/auth' },
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
