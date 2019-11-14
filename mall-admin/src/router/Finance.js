export default {
  path: '/admin/finance',
  redirect: '/admin/finance/balance',
  meta: {
    nav: '财务',
    icon: 'icon-caiwu',
    auth: true,
    authCode: 401050
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 支付审核
    {
      path: '/admin/finance/order',
      redirect: '/admin/finance/order/examine',
      meta: {
        title: '支付审核',
        nav: '支付审核',
        icon: 'icon-dingdan1',
        visible: false,
        auth: true,
        authCode: 401101,
        breadcrumb: [
          { title: '首页', path: '/admin' },
          { title: '财务', path: '/admin/finance' },
          { title: '支付审核', path: '' }
        ]
      },
      component: r => require(['@/views/admin/finance/OrderLayout'], r),
      children: [

        // 待审核
        {
          path: '/admin/finance/order/examine',
          meta: {
            title: '待审核',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '支付审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // 审核通过
        {
          path: '/admin/finance/order/pass',
          meta: {
            title: '审核通过',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '支付审核', path: '/admin/finance/order/examine' },
              { title: '审核通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // 审核不通过
        {
          path: '/admin/finance/order/reject',
          meta: {
            title: '审核不通过',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '支付审核', path: '/admin/finance/order/examine' },
              { title: '审核不通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 自营订单详情
        {
          path: '/admin/finance/balance/details',
          meta: {
            title: '订单',
            thirdMenu: false,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务', path: '/admin/finance' },
              { title: '支付审核', path: '/admin/finance/order' },
              { title: '订单详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageDetails'], r)
        }
      ]
    },

    // 账户结算
    {
      path: '/admin/finance/recharge',
      redirect: '/admin/finance/recharge/list',
      meta: {
        title: '账户结算',
        nav: '账户结算',
        icon: 'icon-chongzhi2',
        visible: false,
        auth: true,
        authCode: 401101,
        breadcrumb: [
          { title: '首页', path: '/admin' },
          { title: '财务', path: '/admin/finance' },
          { title: '账户结算', path: '' }
        ]
      },
      component: r => require(['@/views/admin/finance/RechargeLayout'], r),
      children: [

        // 账户管理
        {
          path: '/admin/finance/recharge/list',
          meta: {
            title: '账户结算',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '账户结算', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/RechargeList'], r)
        },

        // 充值记录
        {
          path: '/admin/finance/recharge/record',
          meta: {
            title: '充值记录',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '账户结算', path: '/admin/finance/recharge/list' },
              { title: '充值记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/RechargeList'], r)
        },

        // 扣款记录
        {
          path: '/admin/finance/recharge/chargebacks',
          meta: {
            title: '扣款记录',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '账户结算', path: '/admin/finance/recharge/list' },
              { title: '扣款记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/RechargeList'], r)
        },

        // 充值记录详情
        {
          path: '/admin/finance/recharge/details',
          meta: {
            title: '充值记录详情',
            auth: true,
            thirdMenu: false,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '充值记录', path: '/admin/finance/recharge/record' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/PublicDetails'], r)
        }
      ]
    },

    // 结算审核
    {
      path: '/admin/finance/examine',
      redirect: '/admin/finance/examine/all',
      meta: {
        title: '结算审核',
        nav: '结算审核',
        icon: 'icon-shenhe1',
        visible: false,
        auth: true,
        authCode: 401102,
        breadcrumb: [
          { title: '首页', path: '/admin' },
          { title: '财务', path: '/admin/finance' },
          { title: '结算审核', path: '' }
        ]
      },
      component: r => require(['@/views/admin/finance/ExamineLayout'], r),
      children: [
        // 全部
        {
          path: '/admin/finance/examine/all',
          meta: {
            title: '待审核',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '结算审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ExamineList'], r)
        },

        // 待审核
        {
          path: '/admin/finance/examine/index',
          meta: {
            title: '待审核',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '结算审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ExamineList'], r)
        },

        // 审核通过
        {
          path: '/admin/finance/examine/pass',
          meta: {
            title: '审核通过',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '结算审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ExamineList'], r)
        },

        // 审核不通过
        {
          path: '/admin/finance/examine/reject',
          meta: {
            title: '审核不通过',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '结算审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ExamineList'], r)
        },

        // 详情
        {
          path: '/admin/finance/examine/details',
          meta: {
            title: '审核详情',
            auth: true,
            thirdMenu: false,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '结算审核', path: '/admin/finance/examine/' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/PublicDetails'], r)
        }
      ]
    },

    // 结算管理
    {
      path: '/admin/finance/balance',
      redirect: '/admin/finance/balance/wait',
      meta: {
        title: '结算管理',
        nav: '结算管理',
        icon: 'icon-shenhe1',
        auth: true,
        authCode: 401051,
        breadcrumb: [
          { title: '首页', path: '/admin' },
          { title: '财务', path: '/admin/finance' },
          { title: '结算管理', path: '' }
        ]
      },
      component: r => require(['@/views/admin/finance/BalanceLayout'], r),
      children: [
        // 待结算订单
        {
          path: '/admin/finance/balance/wait',
          meta: {
            title: '结算管理 - 全部',
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '结算管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // 结算记录
        {
          path: '/admin/finance/balance/record',
          meta: {
            title: '结算记录',
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '结算管理', path: '/admin/finance/balance' },
              { title: '结算记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/balanceList'], r)
        },

        // 结算记录
        {
          path: '/admin/finance/balance/record/list',
          meta: {
            title: '结算记录 - 查看明细',
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '结算管理', path: '/admin/finance/balance' },
              { title: '结算记录', path: '/admin/finance/balance/record' },
              { title: '查看明细', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/balanceDetails'], r)
        },

        // 结算记录订单详情
        {
          path: '/admin/finance/balance/record/details',
          meta: {
            title: '订单详情',
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务', path: '/admin/finance' },
              { title: '结算管理', path: '/admin/finance/balance' },
              { title: '结算记录', path: '/admin/finance/balance/record' },
              { title: '订单详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageDetails'], r)
        }
      ]
    }
  ]
}
