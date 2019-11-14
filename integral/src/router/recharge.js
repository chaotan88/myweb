export default {
  path: '/recharge',
  redirect: '/recharge/recharge',
  meta: {
    nav: '预付充值',
    title: '预付充值'
  },
  component: r => require(['views/recharge/Layout'], r),
  children: [
    {
      path: '/recharge/recharge',
      meta: {
        nav: '预付充值',
        title: '预付充值'
      },
      component: r => require(['views/recharge/recharge'], r)
    },
    {
      path: '/pay/payment',
      meta: {
        nav: '充值付款',
        title: '充值付款'
      },
      component: r => require(['views/recharge/payment'], r)
    },
    {
      path: '/recharge/paySuccess',
      meta: {
        nav: '充值结果',
        title: '充值结果'
      },
      component: r => require(['views/recharge/paySuccess'], r)
    }
  ]
}
