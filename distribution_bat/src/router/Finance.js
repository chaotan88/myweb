// 财务
export default {
  path: '/admin/finance',
  redirect: '/admin/finance/reflect',
  meta: {
    nav: '财务',
    icon: 'icon-caiwu',
    auth: true,
    authCode: 601040
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 提现管理
    {
      path: '/admin/finance/reflect',
      redirect: '/admin/finance/reflect/all',
      meta: {
        nav: '提现管理',
        icon: 'icon-yuetixian',
        // refresh: false,           // 刷新页面
        auth: true,
        authCode: 601041
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
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务', path: '/admin/finance' },
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
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务', path: '/admin/finance' },
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
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务', path: '/admin/finance' },
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
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务', path: '/admin/finance' },
              { title: '提现管理', path: '/admin/finance/reflect' },
              { title: '回退', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/ReflectList'], r)
        }
      ]
    },

    // 转赠管理
    {
      path: '/admin/finance/giftGiving',
      redirect: '/admin/finance/giftGiving/list',
      meta: {
        title: '转赠管理',
        nav: '转赠管理',
        icon: 'icon-shenhe1',
        auth: true,
        authCode: 601042,
        breadcrumb: [
          { title: '首页', path: '' },
          { title: '转赠管理', path: '/admin/finance/giftGiving/list' },
          { title: '转赠列表', path: '' }
        ]
      },
      component: r => require(['@/views/admin/finance/giftGivingLayout.vue'], r),
      children: [
        // 转赠列表
        {
          path: '/admin/finance/giftGiving/list',
          meta: {
            title: '转赠管理',
            auth: true,
            authCode: 601042,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '转赠管理', path: '/admin/finance/giftGiving/list' },
              { title: '转赠列表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/giftGivingList.vue'], r)
        }
      ]
    },

    // 预付充值
    {
      path: '/admin/finance/advancet',
      redirect: '/admin/finance/advancet/advancetlist',
      meta: {
        nav: '预付充值',
        icon: 'icon-yuetixian',
        // refresh: false,           // 刷新页面
        auth: true,
        authCode: 601043
      },
      component: r => require(['@/views/admin/finance/AdvanceLayout'], r),
      children: [

        // 预付充值
        {
          path: '/admin/finance/advancet/advancetlist',
          meta: {
            title: '预付充值',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601043,
            breadcrumb: [
              { title: '预付充值', path: '/admin/finance/advancet/advancetlist' },
              { title: '充值设置', path: '/admin/finance/advancet/set' }
            ]
          },
          component: r => require(['@/views/admin/finance/AdvancetList'], r)
        },

        // 预付充值详情
        {
          path: '/admin/finance/advancet/advancetlist/details',
          meta: {
            title: '预付充值',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601043,
            breadcrumb: [
              { title: '预付充值', path: '/admin/finance/advancet/advancetlist' },
              { title: '充值设置', path: '/admin/finance/advancet/set' }
            ]
          },
          component: r => require(['@/views/admin/finance/AdvancetDetails'], r)
        },

        // 充值设置
        {
          path: '/admin/finance/advancet/set',
          meta: {
            title: '充值设置',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601043,
            breadcrumb: [
              { title: '预付充值', path: '/admin/finance/advancet/advancetlist' },
              { title: '充值设置', path: '/admin/finance/advancet/set' }
            ]
          },
          component: r => require(['@/views/admin/finance/RechargeSet'], r)
        }
      ]
    },

    // 线下充值审核
    {
      path: '/admin/finance/rechargeAudit',
      redirect: '/admin/finance/rechargeAudit/all',
      meta: {
        title: '线下充值审核',
        nav: '线下充值审核',
        icon: 'icon-shenhe1',
        auth: true,
        authCode: 601044,
        breadcrumb: [
          { title: '首页', path: '' },
          { title: '财务管理', path: '/admin/finance/order/all' },
          { title: '线下充值审核', path: '' }
        ]
      },
      component: r => require(['@/views/admin/finance/rechargeAudit/layout'], r),
      children: [
        // 全部
        {
          path: '/admin/finance/rechargeAudit/all',
          meta: {
            title: '全部',
            auth: true,
            authCode: 601044,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '线下充值审核', path: '/admin/finance/rechargeAudit/all' },
              { title: '全部', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/rechargeAudit/list'], r)
        },

        // 待处理
        {
          path: '/admin/finance/rechargeAudit/index',
          meta: {
            title: '待处理',
            auth: true,
            authCode: 601044,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '线下充值审核', path: '/admin/finance/rechargeAudit/all' },
              { title: '待处理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/rechargeAudit/list'], r)
        },

        // 审核通过
        {
          path: '/admin/finance/rechargeAudit/pass',
          meta: {
            title: '审核通过',
            auth: true,
            authCode: 601044,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '线下充值审核', path: '/admin/finance/rechargeAudit/all' },
              { title: '审核通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/rechargeAudit/list'], r)
        },

        // 审核不通过
        {
          path: '/admin/finance/rechargeAudit/reject',
          meta: {
            title: '审核不通过',
            auth: true,
            authCode: 601044,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '线下充值审核', path: '/admin/finance/rechargeAudit/all' },
              { title: '审核不通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/rechargeAudit/list'], r)
        },

        // 详情
        {
          path: '/admin/finance/rechargeAudit/details',
          meta: {
            title: '详情',
            auth: true,
            thirdMenu: false,
            authCode: 601044,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '线下充值审核', path: '/admin/finance/rechargeAudit/all' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/rechargeAudit/details'], r)
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
        auth: true,
        authCode: 601045,
        breadcrumb: [
          { title: '首页', path: '' },
          { title: '财务管理', path: '/admin/finance/order/all' },
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
            authCode: 601045,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
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
            authCode: 601045,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
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
            authCode: 601045,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance' },
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
            authCode: 601045,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '充值记录', path: '/admin/finance/recharge/record' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/PublicDetails'], r)
        }
      ]
    },

    // 账户结算审核
    {
      path: '/admin/finance/examine',
      redirect: '/admin/finance/examine/all',
      meta: {
        title: '账户结算审核',
        nav: '账户结算审核',
        icon: 'icon-shenhe1',
        auth: true,
        authCode: 601046,
        breadcrumb: [
          { title: '首页', path: '' },
          { title: '财务管理', path: '/admin/finance/order/all' },
          { title: '账户结算审核', path: '' }
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
            authCode: 601046,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '账户结算审核', path: '' }
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
            authCode: 601046,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '账户结算审核', path: '/admin/finance/examine/all' },
              { title: '待审核', path: '' }
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
            authCode: 601046,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '账户结算审核', path: '/admin/finance/examine/all' },
              { title: '审核通过', path: '' }
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
            authCode: 601046,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '账户结算审核', path: '/admin/finance/examine/all' },
              { title: '审核不通过', path: '' }
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
            authCode: 601046,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/PublicDetails'], r)
        }
      ]
    }
  ]
}
