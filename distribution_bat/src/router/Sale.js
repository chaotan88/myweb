export default {
  path: '/admin/sale',
  redirect: '/admin/sale/payment',
  meta: {
    nav: '销售结算',
    icon: 'icon-jiesuan',
    auth: true,
    authCode: 601030
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    // 付款审核
    {
      path: '/admin/sale/payment',
      redirect: '/admin/sale/payment/all',
      meta: {
        nav: '付款审核',
        icon: 'icon-fukuanshenhe',
        auth: true,
        authCode: 601031
      },
      component: r => require(['@/views/admin/sale/PaymentLayout'], r),
      children: [

        // 付款审核 - 全部
        {
          path: '/admin/sale/payment/all',
          meta: {
            title: '付款审核 - 全部',
            pageBack: true,
            auth: true,
            authCode: 601031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '付款审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/PaymentList'], r)
        },

        {
          path: '/admin/sale/payment/examine',
          meta: {
            title: '付款审核 - 付款审核中',
            pageBack: true,
            auth: true,
            authCode: 601031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '付款审核', path: '/admin/sale/payment/all' },
              { title: '付款审核中', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/PaymentList'], r)
        },

        {
          path: '/admin/sale/payment/pass',
          meta: {
            title: '付款审核 - 审核通过',
            pageBack: true,
            auth: true,
            authCode: 601031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '付款审核', path: '/admin/sale/payment/all' },
              { title: '审核通过', path: '' }

            ]
          },
          component: r => require(['@/views/admin/sale/PaymentList'], r)
        },

        {
          path: '/admin/sale/payment/reject',
          meta: {
            title: '付款审核 - 审核不通',
            pageBack: true,
            auth: true,
            authCode: 601031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '付款审核', path: '/admin/sale/payment/all' },
              { title: '审核不通', path: '' }

            ]
          },
          component: r => require(['@/views/admin/sale/PaymentList'], r)
        },

        {
          path: '/admin/sale/payment/details',
          meta: {
            title: '付款审核 - 详情',
            thirdMenu: false,
            auth: true,
            authCode: 601031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '付款审核', path: '/admin/sale/payment/all' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/PaymentDetails'], r)
        }
      ]
    },

    // 交易记录
    {
      path: '/admin/sale/business',
      redirect: '/admin/sale/business/all',
      meta: {
        nav: '交易记录',
        icon: 'icon-guize',
        auth: true,
        visible: true,
        authCode: 601032
      },
      component: r => require(['@/views/admin/sale/BusinessLayout'], r),
      children: [

        // 交易记录 - 全部
        {
          path: '/admin/sale/business/all',
          meta: {
            title: '交易记录 - 全部',
            pageBack: true,
            auth: true,
            authCode: 601032,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '交易记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BusinessList'], r)
        },

        // 交易记录 - 账户余额
        {
          path: '/admin/sale/business/balance',
          meta: {
            title: '交易记录 - 账户余额',
            pageBack: true,
            auth: true,
            authCode: 601032,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '交易记录', path: '/admin/sale/business/all' },
              { title: '账户余额', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BusinessList'], r)
        },

        // 交易记录 - 通用积分
        {
          path: '/admin/sale/business/cash',
          meta: {
            title: '交易记录 - 通用积分',
            pageBack: true,
            auth: true,
            authCode: 601032,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '交易记录', path: '/admin/sale/business/all' },
              { title: '通用积分', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BusinessList'], r)
        },

        // 交易记录 - 消费积分
        {
          path: '/admin/sale/business/consume',
          meta: {
            title: '交易记录 - 消费积分',
            pageBack: true,
            auth: true,
            authCode: 601032,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '交易记录', path: '/admin/sale/business/all' },
              { title: '消费积分', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BusinessList'], r)
        }

        // // 交易记录 - 详情
        // {
        //   path: '/admin/sale/business/details',
        //   meta: {
        //     title: '交易记录 - 消费积分',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '首页', path: '/admin/console' },
        //       { title: '销售结算', path: '/admin/sale' },
        //       { title: '交易记录', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/sale/BusinessDetails'], r)
        // }
      ]
    },

    // 结算管理列表
    {
      path: '/admin/sale/balance',
      redirect: '/admin/sale/balance/list',
      meta: {
        nav: '结算管理',
        auth: true,
        visible: true,
        icon: 'icon-jiesuan1',
        authCode: 601033
      },
      component: r => require(['@/views/admin/sale/BalanceLayout'], r),
      children: [

        // 结算管理 - 列表
        {
          path: '/admin/sale/balance/list',
          meta: {
            title: '结算管理 - 结算记录 - 全部',
            pageBack: true,
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BalanceList'], r)
        },

        // 结算管理 - 列表 - 详情
        {
          path: '/admin/sale/balance/list/manage',
          meta: {
            title: '结算管理 - 结算记录 - 全部',
            pageBack: true,
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BalanceManage'], r)
        },

        // 结算管理-店补结算
        {
          path: '/admin/sale/balance/shop',
          redirect: '/admin/sale/balance/shop/all',
          meta: {
            title: '结算管理 - 店补结算',
            pageBack: true,
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '店补结算', path: '/admin/sale/balance/shop' }
            ]
          },
          component: r => require(['@/views/admin/sale/ShopSettlement'], r),
          children: [
            // 付款审核 - 全部
            {
              path: '/admin/sale/balance/shop/all',
              meta: {
                title: '结算管理 - 店补结算 - 全部',
                pageBack: true,
                auth: true,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '销售结算', path: '/admin/sale' },
                  { title: '结算管理', path: '/admin/sale/balance' },
                  { title: '店补结算', path: '/admin/sale/balance/shop' },
                  { title: '全部', path: '' }
                ]
              },
              component: r => require(['@/views/admin/sale/ShopSettlementList'], r)
            },
            {
              path: '/admin/sale/balance/shop/await',
              meta: {
                title: '结算管理 - 店补结算 - 待结算',
                pageBack: true,
                auth: true,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '销售结算', path: '/admin/sale' },
                  { title: '结算管理', path: '/admin/sale/balance' },
                  { title: '店补结算', path: '/admin/sale/balance/shop' },
                  { title: '待结算', path: '' }
                ]
              },
              component: r => require(['@/views/admin/sale/ShopSettlementList'], r)
            },
            {
              path: '/admin/sale/balance/shop/already',
              meta: {
                title: '结算管理 - 店补结算 - 已结算',
                pageBack: true,
                auth: true,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '销售结算', path: '/admin/sale' },
                  { title: '结算管理', path: '/admin/sale/balance' },
                  { title: '店补结算', path: '/admin/sale/balance/shop' },
                  { title: '已结算', path: '' }
                ]
              },
              component: r => require(['@/views/admin/sale/ShopSettlementList'], r)
            }
          ]
        },

        // 结算管理 - 结算设置
        {
          path: '/admin/sale/balance/set',
          meta: {
            title: '结算管理 - 结算记录 - 全部',
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '结算设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BusinessSet'], r)
        },

        // 结算管理 - 店补设置
        {
          path: '/admin/sale/balance/settleSet',
          meta: {
            title: '结算管理 - 结算记录 - 全部',
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '店补设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BusinessSettleSet'], r)
        }
      ]
    },

    // 结算管理 - 结算记录
    {
      path: '/admin/sale/balance/record',
      redirect: '/admin/sale/balance/record/all',
      meta: {
        nav: '结算记录',
        auth: true,
        visible: false,
        authCode: 601033
      },
      component: r => require(['@/views/admin/sale/BalanceRecordLayout'], r),
      children: [

        // 结算管理 - 结算记录 - 全部
        {
          path: '/admin/sale/balance/record/all',
          meta: {
            title: '结算管理 - 结算记录 - 全部',
            pageBack: true,
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '结算记录', path: '/admin/sale/balance/record' },
              { title: '全部', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BalanceRecord'], r)
        },

        // 结算管理 - 结算记录 - 推荐反佣
        {
          path: '/admin/sale/balance/record/recommend',
          meta: {
            title: '结算管理 - 结算记录 - 推荐反佣',
            pageBack: true,
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '结算记录', path: '/admin/sale/balance/record' },
              { title: '推荐反佣', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BalanceRecord'], r)
        },

        // 结算管理 - 结算记录 - 商品收益
        {
          path: '/admin/sale/balance/record/earning',
          meta: {
            title: '结算管理 - 结算记录 - 商品收益',
            pageBack: true,
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '结算记录', path: '/admin/sale/balance/record' },
              { title: '商品收益', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BalanceRecord'], r)
        },

        // 结算管理 - 结算记录 - 全球加权分红
        {
          path: '/admin/sale/balance/record/share',
          meta: {
            title: '结算管理 - 结算记录 - 全球加权分红',
            pageBack: true,
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '结算记录', path: '/admin/sale/balance/record' },
              { title: '全球加权分红', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BalanceRecord'], r)
        },

        // 结算管理 - 结算记录 - 办公场地补贴
        {
          path: '/admin/sale/balance/record/site-subsidy',
          meta: {
            title: '结算管理 - 结算记录 - 办公场地补贴',
            pageBack: true,
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '结算记录', path: '/admin/sale/balance/record' },
              { title: '办公场地补贴', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BalanceRecord'], r)
        },

        // 结算管理 - 结算记录 - 芯片销售收益
        {
          path: '/admin/sale/balance/record/chip',
          meta: {
            title: '结算管理 - 结算记录 - 全部',
            pageBack: true,
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '结算记录', path: '/admin/sale/balance/record' },
              { title: '芯片销售收益', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BalanceRecord'], r)
        },

        // 结算管理 - 结算记录 - 店补
        {
          path: '/admin/sale/balance/record/store',
          meta: {
            title: '结算管理 - 结算记录 - 全部',
            pageBack: true,
            auth: true,
            authCode: 601033,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '销售结算', path: '/admin/sale' },
              { title: '结算管理', path: '/admin/sale/balance' },
              { title: '结算记录', path: '/admin/sale/balance/record' },
              { title: '芯片销售收益', path: '' }
            ]
          },
          component: r => require(['@/views/admin/sale/BalanceRecord'], r)
        }
      ]
    }
  ]
}
