export default {
  path: '/pay',
  redirect: '/pay/orderPay',
  meta: {
    nav: '支付'
  },
  component: r => require(['views/user/Layout'], r),
  children: [
    {
      path: '/pay/orderPay',
      meta: {
        title: '支付',
        nav: '支付'
      },
      component: r => require(['views/pay/pay'], r)
    },
    {
      path: '/pay/offlinePay',
      meta: {
        title: '线下支付',
        nav: '线下支付'
      },
      component: r => require(['views/pay/offlinePay'], r)
    },
    {
      path: '/pay/offlinePay1',
      meta: {
        title: '线下支付',
        nav: '线下支付'
      },
      component: r => require(['views/pay/offlinePay1'], r)
    },
    {
      path: '/pay/paySuccess',
      meta: {
        title: '支付结果',
        nav: '支付结果'
      },
      component: r => require(['views/pay/paySuccess'], r)
    }
  ]
}
