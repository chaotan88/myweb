// 财务
export default {
  path: '/admin/finance',
  redirect: '/admin/finance/reflect',
  meta: {
    nav: '财务管理',
    icon: 'icon-caiwu',
    auth: true,
    authCode: 601050
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    // 佣金流水
    {
      path: '/admin/finance/transactionRecord',
      redirect: '/admin/finance/transactionRecord/all',
      meta: {
        nav: '佣金流水',
        icon: 'icon-yuetixian',
        // refresh: false,           // 刷新页面
        auth: true,
        authCode: 601051
      },
      component: r => require(['@/views/admin/finance/TransactionRecordLayout'], r),
      children: [
        {
          path: '/admin/finance/transactionRecord/all',
          meta: {
            title: '全部',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601051,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '佣金流水', path: '/admin/finance/transactionRecord' },
              { title: '全部', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/TransactionRecordList'], r)
        }
      ]
    },

    // 提现管理
    {
      path: '/admin/finance/reflect',
      redirect: '/admin/finance/reflect/all',
      meta: {
        nav: '提现管理',
        icon: 'icon-yuetixian',
        // refresh: false,           // 刷新页面
        auth: true,
        authCode: 601052
      },
      component: r => require(['@/views/admin/finance/ReflectLayout'], r),
      children: [
        {
          path: '/admin/finance/reflect/all',
          meta: {
            title: '全部',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601052,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '提现管理', path: '/admin/finance/reflect' },
              { title: '全部', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ReflectList'], r)
        },

        {
          path: '/admin/finance/reflect/index',
          meta: {
            title: '待处理',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601052,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '提现管理', path: '/admin/finance/reflect' },
              { title: '待处理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ReflectList'], r)
        },

        {
          path: '/admin/finance/reflect/processed',
          meta: {
            title: '已处理',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601052,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '提现管理', path: '/admin/finance/reflect' },
              { title: '已处理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ReflectList'], r)
        },

        {
          path: '/admin/finance/reflect/back',
          meta: {
            title: '回退',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601052,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '提现管理', path: '/admin/finance/reflect' },
              { title: '回退', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ReflectList'], r)
        },

        {
          path: '/admin/finance/reflect/exception',
          meta: {
            title: '打款异常',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601052,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '提现管理', path: '/admin/finance/reflect' },
              { title: '打款异常', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ReflectList'], r)
        },

        {
          path: '/admin/finance/reflect/transfer',
          meta: {
            title: '打款中',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601052,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '提现管理', path: '/admin/finance/reflect' },
              { title: '打款中', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ReflectList'], r)
        }
      ]
    },

    // 提现设置
    {
      path: '/admin/finance/setting',
      redirect: '/admin/finance/setting/reflectSetting',
      meta: {
        title: '提现设置',
        nav: '提现设置',
        icon: 'icon-shenhe1',
        auth: false,
        // authCode: 601049,
        breadcrumb: [
          { title: '首页', path: '' }
        ]
      },
      component: r => require(['@/views/admin/finance/ReflectSettingLayout.vue'], r),
      children: [
        // 提现设置
        {
          path: '/admin/finance/setting/reflectSetting',
          meta: {
            title: '提现设置',
            pageBack: true,
            // refresh: false,
            auth: false,
            // authCode: 601049,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '提现管理', path: '/admin/finance/reflect' },
              { title: '提现设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ReflectSetting'], r)
        }
      ]
    },

    // 财务对账
    {
      path: '/admin/finance/financeReconciliation',
      redirect: '/admin/finance/financeReconciliation/index',
      meta: {
        nav: '财务对账',
        icon: 'icon-yuetixian',
        // refresh: false,           // 刷新页面
        auth: true,
        authCode: 601053
      },
      component: r => require(['@/views/admin/finance/FinanceReconciliationLayout'], r),
      children: [
        {
          path: '/admin/finance/financeReconciliation/index',
          meta: {
            title: '全部',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601053,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '财务对账', path: '/admin/finance/financeReconciliation' }
            ]
          },
          component: r => require(['@/views/admin/finance/FinanceReconciliation'], r)
        }
      ]
    },

    // 账户管理
    {
      path: '/admin/finance/account',
      redirect: '/admin/finance/account/index',
      meta: {
        nav: '账户管理',
        icon: 'icon-yuetixian',
        // refresh: false,           // 刷新页面
        auth: true,
        authCode: 601053
      },
      component: r => require(['@/views/admin/finance/AccountLayout'], r),
      children: [
        {
          path: '/admin/finance/account/index',
          meta: {
            title: '账户管理',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601053,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '账户管理', path: '/admin/finance/account' }
            ]
          },
          component: r => require(['@/views/admin/finance/Account'], r)
        },
        {
          path: '/admin/finance/account/detail',
          meta: {
            title: '账户管理',
            pageBack: true,
            // refresh: false,
            auth: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '账户管理', path: '/admin/finance/detail' }
            ]
          },
          component: r => require(['@/views/admin/finance/AccountDetail'], r)
        }
      ]
    },

    // 推广大使详情
    {
      path: '/admin/finance/detail',
      redirect: '/admin/finance/detail/index',
      meta: {
        title: '推广大使详情',
        nav: '推广大使详情',
        icon: 'icon-shenhe1',
        auth: false,
        // authCode: 601049,
        breadcrumb: [
          { title: '首页', path: '' }
        ]
      },
      component: r => require(['@/views/admin/finance/AccountDetailLayout.vue'], r),
      children: [
        // 推广大使详情
        {
          path: '/admin/finance/detail/index',
          meta: {
            title: '推广大使详情',
            pageBack: true,
            // refresh: false,
            auth: false,
            // authCode: 601049,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '账户管理', path: '/admin/finance/account' },
              { title: '推广大使详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/AccountDetail'], r)
        }
      ]
    }
  ]
}
