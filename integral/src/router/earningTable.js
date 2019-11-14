export default {
  path: '/earningTable',
  redirect: '/earningTable/index',
  meta: {
    nav: '收益报表',
    title: '收益报表'
  },
  components: r => require(['views/user/Layout'], r),
  children: [
    // ------------收益报表
    {
      path: '/earningTable/index',
      meta: {
        nav: '收益报表',
        title: '收益报表'
      },
      component: r => require(['views/earningTable/index'], r)
    }
  ]
}
