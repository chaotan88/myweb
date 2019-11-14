export default {
  path: '/admin/finance',
  redirect: '/admin/finance/recharge',
  meta: {
    nav: '财务管理',
    icon: 'icon-caiwu',
    auth: true,
    authCode: 501060
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // ----------- 支付审核
    {
      path: '/admin/finance/order',
      redirect: '/admin/finance/order/all',
      meta: {
        title: '支付审核',
        nav: '支付审核',
        icon: 'icon-dingdan',
        visible: true,
        auth: true,
        authCode: 501061,
        breadcrumb: [
          { title: '首页', path: '' },
          { title: '财务管理', path: '/admin/finance' },
          { title: '支付审核', path: '' }
        ]
      },
      component: r => require(['@/views/admin/finance/OrderLayout'], r),
      children: [

        // 全部
        {
          path: '/admin/finance/order/all',
          meta: {
            title: '待审核',
            auth: true,
            authCode: 501061,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '支付审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // 待审核
        {
          path: '/admin/finance/order/examine',
          meta: {
            title: '待审核',
            auth: true,
            authCode: 501061,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '支付审核', path: '/admin/finance/order' },
              { title: '待审核', path: '' }
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
            authCode: 501061,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '支付审核', path: '/admin/finance/order' },
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
            authCode: 501061,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '支付审核', path: '/admin/finance/order' },
              { title: '审核不通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 自营订单详情
        {
          path: '/admin/finance/order/details',
          meta: {
            title: '订单',
            thirdMenu: false,
            auth: true,
            authCode: 501061,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '支付审核', path: '/admin/finance/order' },
              { title: '订单详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageDetails'], r)
        }
      ]
    },

    // // ----------- 账户结算
    // {
    //   path: '/admin/finance/recharge',
    //   redirect: '/admin/finance/recharge/list',
    //   meta: {
    //     title: '账户结算',
    //     nav: '账户结算',
    //     icon: 'icon-chongzhi2',
    //     auth: true,
    //     authCode: 501062,
    //     visible: false,
    //     breadcrumb: [
    //       { title: '首页', path: '' },
    //       { title: '财务管理', path: '/admin/finance/order/all' },
    //       { title: '账户结算', path: '' }
    //     ]
    //   },
    //   component: r => require(['@/views/admin/finance/RechargeLayout'], r),
    //   children: [

    //     // 账户管理
    //     {
    //       path: '/admin/finance/recharge/list',
    //       meta: {
    //         title: '账户结算',
    //         auth: true,
    //         authCode: 501062,
    //         breadcrumb: [
    //           { title: '首页', path: '/admin' },
    //           { title: '财务管理', path: '/admin/finance/order/all' },
    //           { title: '账户结算', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/finance/RechargeList'], r)
    //     },

    //     // 充值记录
    //     {
    //       path: '/admin/finance/recharge/record',
    //       meta: {
    //         title: '充值记录',
    //         auth: true,
    //         authCode: 501062,
    //         breadcrumb: [
    //           { title: '首页', path: '/admin' },
    //           { title: '财务管理', path: '/admin/finance/order/all' },
    //           { title: '账户结算', path: '/admin/finance/recharge/list' },
    //           { title: '充值记录', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/finance/RechargeList'], r)
    //     },

    //     // 扣款记录
    //     {
    //       path: '/admin/finance/recharge/chargebacks',
    //       meta: {
    //         title: '扣款记录',
    //         auth: true,
    //         authCode: 501062,
    //         breadcrumb: [
    //           { title: '首页', path: '/admin' },
    //           { title: '财务管理', path: '/admin/finance' },
    //           { title: '账户结算', path: '/admin/finance/recharge/list' },
    //           { title: '扣款记录', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/finance/RechargeList'], r)
    //     },

    //     // 充值记录详情
    //     {
    //       path: '/admin/finance/recharge/details',
    //       meta: {
    //         title: '充值记录详情',
    //         auth: true,
    //         thirdMenu: false,
    //         authCode: 501062,
    //         breadcrumb: [
    //           { title: '首页', path: '/admin' },
    //           { title: '财务管理', path: '/admin/finance' },
    //           { title: '充值记录', path: '/admin/finance/recharge/record' },
    //           { title: '详情', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/finance/PublicDetails'], r)
    //     }
    //   ]
    // },

    // // ----------- 账户结算审核
    // {
    //   path: '/admin/finance/examine',
    //   redirect: '/admin/finance/examine/all',
    //   meta: {
    //     title: '账户结算审核',
    //     nav: '账户结算审核',
    //     icon: 'icon-shenhe1',
    //     auth: true,
    //     authCode: 501063,
    //     visible: false,
    //     breadcrumb: [
    //       { title: '首页', path: '' },
    //       { title: '财务管理', path: '/admin/finance/order/all' },
    //       { title: '账户结算审核', path: '' }
    //     ]
    //   },
    //   component: r => require(['@/views/admin/finance/ExamineLayout'], r),
    //   children: [
    //     // 全部
    //     {
    //       path: '/admin/finance/examine/all',
    //       meta: {
    //         title: '待审核',
    //         auth: true,
    //         authCode: 501063,
    //         breadcrumb: [
    //           { title: '首页', path: '/admin' },
    //           { title: '财务管理', path: '/admin/finance/order/all' },
    //           { title: '账户结算审核', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/finance/ExamineList'], r)
    //     },

    //     // 待审核
    //     {
    //       path: '/admin/finance/examine/index',
    //       meta: {
    //         title: '待审核',
    //         auth: true,
    //         authCode: 501063,
    //         breadcrumb: [
    //           { title: '首页', path: '/admin' },
    //           { title: '财务管理', path: '/admin/finance/order/all' },
    //           { title: '账户结算审核', path: '/admin/finance/examine/all' },
    //           { title: '待审核', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/finance/ExamineList'], r)
    //     },

    //     // 审核通过
    //     {
    //       path: '/admin/finance/examine/pass',
    //       meta: {
    //         title: '审核通过',
    //         auth: true,
    //         authCode: 501063,
    //         breadcrumb: [
    //           { title: '首页', path: '/admin' },
    //           { title: '财务管理', path: '/admin/finance/order/all' },
    //           { title: '账户结算审核', path: '/admin/finance/examine/all' },
    //           { title: '审核通过', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/finance/ExamineList'], r)
    //     },

    //     // 审核不通过
    //     {
    //       path: '/admin/finance/examine/reject',
    //       meta: {
    //         title: '审核不通过',
    //         auth: true,
    //         authCode: 501063,
    //         breadcrumb: [
    //           { title: '首页', path: '/admin' },
    //           { title: '财务管理', path: '/admin/finance/order/all' },
    //           { title: '账户结算审核', path: '/admin/finance/examine/all' },
    //           { title: '审核不通过', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/finance/ExamineList'], r)
    //     },

    //     // 详情
    //     {
    //       path: '/admin/finance/examine/details',
    //       meta: {
    //         title: '审核详情',
    //         auth: true,
    //         thirdMenu: false,
    //         authCode: 501063,
    //         breadcrumb: [
    //           { title: '首页', path: '/admin' },
    //           { title: '财务管理', path: '/admin/finance/order/all' },
    //           { title: '详情', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/finance/PublicDetails'], r)
    //     }
    //   ]
    // },

     // ----------- 供应商结算
    {
      path: '/admin/finance/supplier',
      redirect: '/admin/finance/supplier/oderlist',
      meta: {
        title: '供应商结算',
        nav: '供应商结算',
        icon: 'icon-taocanguanli',
        auth: true,
        authCode: 501062,
        breadcrumb: [
          { title: '首页', path: '' },
          { title: '财务管理', path: '' },
          { title: '供应商结算', path: '' }
        ]
      },
      component: r => require(['@/views/admin/finance/SupplierLayout'], r),
      children: [
        // 供应商结算
        {
          path: '/admin/finance/supplier/oderlist',
          meta: {
            title: '供应商结算',
            auth: true,
            authCode: 501062,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '供应商结算', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/SupplierList'], r)
        },

        // 供应商结算订单
        {
          path: '/admin/finance/supplier/details',
          meta: {
            title: '审核详情',
            auth: true,
            thirdMenu: false,
            authCode: 501062,
            refresh: false,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '供应商结算', path: '/admin/finance/supplier/oderlist' },
              { title: '结算', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/SupplierDetails'], r)
        },

        // 结算记录
        {
          path: '/admin/finance/supplier/record/settlement',
          meta: {
            title: '结算记录',
            auth: true,
            authCode: 501062,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '供应商结算', path: '/admin/finance/supplier/oderlist' },
              { title: '结算记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/SettlementRecord'], r)
        },

        // 结算记录详情
        {
          path: '/admin/finance/supplier/record/details',
          meta: {
            title: '审核详情',
            auth: true,
            thirdMenu: false,
            authCode: 501062,
            refresh: false,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '供应商结算', path: '/admin/finance/supplier/oderlist' },
              { title: '结算记录', path: '/admin/finance/supplier/record/settlement' },
              { title: '结算记录详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/RecordDetails'], r)
        },

        // 结算记录 - 继续结算
        {
          path: '/admin/finance/supplier/record/continue',
          meta: {
            title: '结算记录',
            auth: true,
            authCode: 501062,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '供应商结算', path: '/admin/finance/supplier/oderlist' },
              { title: '结算记录', path: '/admin/finance/supplier/record/settlement' },
              { title: '继续结算', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/SupplierSingle'], r)
        },

        // 生成结算单
        {
          path: '/admin/finance/supplier/record/single',
          meta: {
            title: '审核详情',
            auth: true,
            thirdMenu: false,
            authCode: 501062,
            refresh: false,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '供应商结算', path: '/admin/finance/supplier/oderlist' },
              { title: '审核详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/SupplierSingle'], r)
        },

         // 结算记录详情
        {
          path: '/admin/finance/supplier/record/order/details',
          meta: {
            title: '审核详情',
            auth: true,
            thirdMenu: false,
            authCode: 501062,
            refresh: false,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '财务管理', path: '/admin/finance' },
              { title: '结算审核', path: '/admin/finance/record' },
              { title: '审核详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageDetails'], r)
        }
      ]
    },

    // -------------专区分佣管理
    {
      path: '/admin/finance/commission',
      redirect: '/admin/finance/commission/list',
      meta: {
        nav: '专区分佣管理',
        icon: 'icon-taocanguanli',
        auth: true,
        authCode: 501063
      },
      component: r => require(['@/views/admin/finance/commission/layout'], r),
      children: [

        // 专区分佣管理列表
        {
          path: '/admin/finance/commission/list',
          meta: {
            title: '专区分佣管理',
            auth: true,
            authCode: 501063,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '专区分佣管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance//commission/list'], r)
        },

        // 利润率分佣
        {
          path: '/admin/finance/commission/profit/index',
          meta: {
            title: '专区分佣管理',
            auth: true,
            authCode: 501063,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '专区分佣管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance//profit/index'], r)
        },

        // 买卖仓分佣
        {
          path: '/admin/finance/commission/share/index',
          meta: {
            title: '专区分佣管理',
            auth: true,
            authCode: 501063,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '专区分佣管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance//share/layout'], r),
          children: [
            // 买卖仓分佣
            {
              path: '/admin/finance/commission/share/index',
              meta: {
                title: '专区分佣管理',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance//share/index'], r)
            },

             // 分享收益
            {
              path: '/admin/finance/commission/share/profit',
              meta: {
                title: '专区分佣管理',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/share/ReportForm'], r)
            },

             // 团队分佣
            {
              path: '/admin/finance/commission/share/team',
              meta: {
                title: '专区分佣管理',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/share/ReportForm'], r)
            },

             // 全球分红
            {
              path: '/admin/finance/commission/share/bonus',
              meta: {
                title: '专区分佣管理',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/share/ReportForm'], r)
            }
          ]
        },

       // 买卖仓分佣
        {
          path: '/admin/finance/commission/share/edit',
          meta: {
            title: '专区分佣管理',
            auth: true,
            authCode: 501063,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '买卖仓分佣', path: '/admin/finance/commission/share/index' },
              { title: '专区分佣管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/share/Edit'], r)
        },

        // 拼团奖励
        {
          path: '/admin/finance/commission/groupAward/index',
          meta: {
            title: '拼团奖励',
            auth: true,
            authCode: 501063,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '专区分佣管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/groupAward/layout'], r),
          children: [
            // 拼团奖励
            {
              path: '/admin/finance/commission/groupAward/index',
              meta: {
                title: '拼团奖励',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/groupAward/index'], r)
            },

            // 拼团奖励-编辑
            {
              path: '/admin/finance/commission/groupAward/edit',
              meta: {
                title: '编辑',
                auth: true,
                authCode: 501063,
                thirdMenu: false,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '/admin/finance/commission' },
                  { title: '拼团奖励-编辑', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/groupAward/awardEdit'], r)
            },

            // 团推推
            {
              path: '/admin/finance/commission/groupAward/push',
              meta: {
                title: '团推推',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/share/ReportForm'], r)
            }
          ]
        },

        // 会员分佣规则
        {
          path: '/admin/finance/commission/vipRules/index',
          meta: {
            title: '会员分佣规则',
            auth: true,
            authCode: 501063,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '财务管理', path: '/admin/finance/order/all' },
              { title: '专区分佣管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/finance/vipRules/layout'], r),
          children: [
            // 会员分佣规则
            {
              path: '/admin/finance/commission/vipRules/index',
              meta: {
                title: '会员分佣规则',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '会员分佣规则', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/vipRules/index'], r)
            },

            // 会员分佣规则-编辑
            {
              path: '/admin/finance/commission/vipRules/edit',
              meta: {
                title: '编辑',
                auth: true,
                authCode: 501063,
                thirdMenu: false,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '/admin/finance/commission' },
                  { title: '会员分佣规则-编辑', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/vipRules/edit'], r)
            },

            // 团推推
            {
              path: '/admin/finance/commission/vipRules/massPushing',
              meta: {
                title: '团推推',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '/admin/finance/commission' },
                  { title: '团推推', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/vipRules/publicObject'], r)
            },
            // 代言权益
            {
              path: '/admin/finance/commission/vipRules/representInterests',
              meta: {
                title: '代言权益',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '/admin/finance/commission' },
                  { title: '代言权益', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/vipRules/publicObject'], r)
            },
            // 绿宝分佣
            {
              path: '/admin/finance/commission/vipRules/greenShare',
              meta: {
                title: '绿宝分佣',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '/admin/finance/commission' },
                  { title: '绿宝分佣', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/vipRules/publicObject'], r)
            },
            // 全球加权分红
            {
              path: '/admin/finance/commission/vipRules/globallyShare',
              meta: {
                title: '全球加权分红',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '/admin/finance/commission' },
                  { title: '全球加权分红', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/vipRules/publicObject'], r)
            },
            // 特殊加权分红
            {
              path: '/admin/finance/commission/vipRules/specialShare',
              meta: {
                title: '特殊加权分红',
                auth: true,
                authCode: 501063,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '财务管理', path: '/admin/finance/order/all' },
                  { title: '专区分佣管理', path: '/admin/finance/commission' },
                  { title: '特殊加权分红', path: '' }
                ]
              },
              component: r => require(['@/views/admin/finance/vipRules/publicObject'], r)
            }
          ]
        }
      ]
    }
  ]
}
