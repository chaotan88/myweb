export default {
  path: '/admin/seting',
  redirect: '/admin/seting/account',
  meta: {
    nav: '设置',
    icon: 'icon-changyonggongju2',
    auth: true,
    authCode: 501080
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // ------------- 账户设置
    {
      path: '/admin/seting/account',
      redirect: '/admin/seting/account/index',
      meta: {
        nav: '账户设置',
        icon: 'icon-zhanghuziliao',
        auth: true,
        authCode: 501081
      },
      component: r => require(['@/views/admin/seting/IndexLayout'], r),
      children: [

        // ----------账户信息
        {
          path: '/admin/seting/account/index',
          meta: {
            title: '账户信息',
            auth: true,
            authCode: 501081,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '账户设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/Index'], r)
        },

        // ----------修改密码
        {
          path: '/admin/seting/account/reset',
          meta: {
            title: '修改密码',
            auth: true,
            authCode: 501081,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '修改密码', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AccountPassword'], r)
        }
      ]
    },

    // ------------- 管理员
    {
      path: '/admin/seting/admin',
      meta: {
        nav: '管理员',
        icon: 'icon-moban',
        auth: true,
        authCode: 501082
      },
      component: r => require(['@/views/admin/seting/AuthLayout'], r),
      children: [

        // ----------管理员
        {
          path: '',
          meta: {
            title: '管理员设置',
            auth: true,
            authCode: 501082,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '管理员', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/Admin'], r)
        },

        // ----------管理员新增
        {
          path: '/admin/seting/admin/add',
          meta: {
            title: '权限设置',
            auth: true,
            authCode: 501082,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '管理员', path: '/admin/seting/admin' },
              { title: '权限设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AdminPublic'], r)
        },

        // ----------管理员编辑
        {
          path: '/admin/seting/admin/edit',
          meta: {
            title: '权限设置',
            auth: true,
            authCode: 501082,
            breadcrumb: [
              { title: '权限设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/AdminPublic'], r)
        }
      ]
    },

    // ------------- 权限组
    {
      path: '/admin/seting/authgroup',
      meta: {
        nav: '权限组',
        icon: 'icon-authority',
        auth: true,
        authCode: 501083
      },
      component: r => require(['@/views/admin/seting/AuthLayout'], r),
      children: [

        // ----------权限组
        {
          path: '',
          meta: {
            title: '权限设置',
            auth: true,
            authCode: 501083,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '权限组', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/Group'], r)
        },

        // ----------权限组新增
        {
          path: '/admin/seting/authgroup/add',
          meta: {
            title: '权限设置',
            auth: true,
            authCode: 501083,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '添加权限组', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/GroupPublic'], r)
        },

        // ----------权限组编辑
        {
          path: '/admin/seting/authgroup/edit',
          meta: {
            title: '权限设置',
            auth: true,
            authCode: 501083,
            breadcrumb: [
              { title: '权限设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/GroupPublic'], r)
        }
      ]
    },

    // ------------- 基础设置
    {
      path: '/admin/seting/basic',
      redirect: '/admin/seting/basic/shoppingMall',
      meta: {
        nav: '基础设置',
        icon: 'icon-zhanghuziliao',
        auth: true,
        authCode: 501084
      },
      component: r => require(['@/views/admin/seting/basic/layout'], r),
      children: [

        // ----------商城设置
        {
          path: '/admin/seting/basic/shoppingMall',
          meta: {
            title: '账户信息',
            auth: true,
            authCode: 501084,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '基础设置', path: '/admin/seting/basic' },
              { title: '商城设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/basic/index'], r)
        },

        // ----------注册协议
        {
          path: '/admin/seting/basic/registrationAgreement',
          meta: {
            title: '注册协议',
            auth: true,
            authCode: 501084,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '基础设置', path: '/admin/seting/basic' },
              { title: '注册协议', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/basic/index'], r)
        },

        // ----------售后服务
        {
          path: '/admin/seting/basic/afterSaleService',
          meta: {
            title: '售后服务',
            auth: true,
            authCode: 501084,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '基础设置', path: '/admin/seting/basic' },
              { title: '售后服务', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/basic/index'], r)
        }
      ]
    },
    // ------------- 支付设置
    {
      path: '/admin/seting/payment',
      redirect: '/admin/seting/payment/index',
      meta: {
        nav: '支付设置',
        icon: 'icon-zhanghuziliao',
        auth: true,
        authCode: 501085
      },
      component: r => require(['@/views/admin/seting/payment/layout'], r),
      children: [

        // ----------支付设置
        {
          path: '/admin/seting/payment/index',
          meta: {
            title: '支付设置',
            auth: true,
            authCode: 501085,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '设置', path: '/admin/seting' },
              { title: '支付设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/seting/payment/index'], r)
        }
      ]
    }
  ]
}
