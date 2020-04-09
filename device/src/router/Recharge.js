export default {
  path: '/admin/recharge',
  redirect: '/admin/recharge/rechargeList',
  meta: {
    nav: 'menu.rechargeManage',
    auth: true,
    authId: 2,
    menuCode: '101030'
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    // 订单列表
    {
      path: '/admin/recharge/rechargeList',
      redirect: '/admin/recharge/rechargeList/index',
      meta: {
        title: 'Payment',
        nav: 'menu.rechargeList',
        icon: 'cooperation-icon1',
        auth: true,
        authId: 10,
        menuCode: '101031',
        breadcrumb: [
          { title: '订单列表', path: '/admin/console/index' }
        ]
      },
      component: r => require(['@/views/admin/recharge/RechargeLayout'], r),
      children: [
        {
          path: '/admin/recharge/rechargeList/index',
          meta: {
            title: 'Payment',
            auth: true,
            breadcrumb: [
              { title: 'common.orderManage', path: '' },
              { title: 'menu.rechargeList', path: '' }
            ]
          },
          component: r => require(['@/views/admin/recharge/RechargeList'], r)
        }
      ]
    },
    {
      path: '/admin/recharge/rechargeSetting',
      redirect: '/admin/recharge/rechargeSetting/index',
      meta: {
        title: 'Payment',
        nav: 'recharge.paymentSetting',
        icon: 'cooperation-icon1',
        auth: true,
        authId: 10,
        menuCode: '101032',
        breadcrumb: [
          { title: '价格设置', path: '' }
        ]
      },
      component: r => require(['@/views/admin/recharge/RechargeLayout'], r),
      children: [
        {
          path: '/admin/recharge/rechargeSetting/index',
          meta: {
            title: 'Payment',
            auth: true,
            breadcrumb: [
              { title: 'common.priceManage', path: '' },
              { title: 'recharge.paymentSetting', path: '' }
            ]
          },
          component: r => require(['@/views/admin/recharge/RechargeSetting'], r)
        }
      ]
    },
    {
      path: '/admin/recharge/rechargeVip',
      redirect: '/admin/recharge/rechargeVip/index',
      meta: {
        title: 'Payment',
        nav: 'common.vipupdate',
        icon: 'cooperation-icon1',
        auth: true,
        authId: 10,
        menuCode: '101033',
        breadcrumb: [
          { title: '充值列表', path: '' }
        ]
      },
      component: r => require(['@/views/admin/recharge/RechargeLayout'], r),
      children: [
        {
          path: '/admin/recharge/rechargeVip/index',
          meta: {
            title: 'Payment',
            auth: true,
            breadcrumb: [
              { title: 'menu.rechargeManage', path: '' },
              { title: 'common.vipupdate', path: '' }
            ]
          },
          component: r => require(['@/views/admin/recharge/RechargeVip'], r)
        }
      ]
    }
    // {
    //   path: '/admin/recharge/rechargeVipSubmit',
    //   redirect: '/admin/recharge/rechargeVipSubmit/index',
    //   meta: {
    //     title: '订单确认',
    //     nav: '订单确认',
    //     icon: 'cooperation-icon1',
    //     auth: true,
    //     authId: 10,
    //     menuCode: '201041',
    //     breadcrumb: [
    //       { title: '充值列表', path: '' }
    //     ]
    //   },
    //   component: r => require(['@/views/admin/recharge/RechargeLayout'], r),
    //   children: [
    //     {
    //       path: '/admin/recharge/rechargeVipSubmit/index',
    //       meta: {
    //         title: '',
    //         auth: true,
    //         breadcrumb: [
    //           { title: '充值管理', path: '' },
    //           { title: '订单确认', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/recharge/RechargeVipSubmit'], r)
    //     }
    //   ]
    // }
  ]
}
