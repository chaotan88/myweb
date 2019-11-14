export default {
  path: '/user',
  redirect: '/user/index',
  meta: {
    nav: '个人中心'
  },
  component: r => require(['views/user/Layout'], r),
  children: [
    {
      path: '/user/index',
      meta: {
        nav: '个人中心',
        title: '个人中心'
      },
      component: r => require(['views/user/Index'], r)
    },

    {
      path: '/user/certification',
      meta: {
        nav: '实名认证',
        title: '实名认证'
      },
      component: r => require(['views/user/RealNameAuth'], r)
    },
    {
      path: '/user/partnerSubmission',
      meta: {
        nav: '提交申请'
      },
      component: r => require(['views/user/partnerSubmission'], r)
    },
    {
      path: '/user/cardManger',
      meta: {
        nav: '银行卡',
        title: '银行卡'
      },
      component: r => require(['views/user/cardManger'], r)
    },
    {
      path: '/user/addCard',
      meta: {
        nav: '添加银行卡',
        title: '添加银行卡'
      },
      component: r => require(['views/user/addCard'], r)
    }
    // {
    //   path: '/user/cardInfo',
    //   meta: {
    //     nav: '银行卡信息',
    //     title: '银行卡信息'
    //   },
    //   component: r => require(['views/user/cardInfo'], r)
    // }
  ]
}
