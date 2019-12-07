// 数据统计
export default {
  path: '/admin/report',
  redirect: '/admin/report/list',
  meta: {
    nav: '数据统计',
    icon: 'icon-weibiaoti4',
    auth: true,
    authCode: 601060
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    // 业绩统计
    {
      path: '/admin/report/achievement',
      redirect: '/admin/report/achievement/list',
      meta: {
        nav: '业绩统计',
        icon: 'icon-paiming',
        auth: true,
        authCode: 601061,
        visible: true
      },
      component: r => require(['@/views/admin/report/AchievementLayout'], r),
      children: [

        // 业绩统计表
        {
          path: '/admin/report/achievement/list',
          meta: {
            title: '业绩统计',
            pageBack: true,
            auth: true,
            authCode: 601061,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '数据统计', path: '/admin/report/' },
              { title: '业绩统计', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/AchievementList'], r)
        }
      ]
    },

    // 推广大使增长
    {
      path: '/admin/report/vip',
      redirect: '/admin/report/vip/increase',
      meta: {
        nav: '推广大使增长',
        icon: 'icon-tianjiayonghu',
        auth: true,
        authCode: 601062,
        visible: true
      },
      component: r => require(['@/views/admin/report/VipLayout'], r),
      children: [

        // 推广大使增长
        {
          path: '/admin/report/vip/increase',
          meta: {
            title: '数据统计',
            pageBack: true,
            auth: true,
            authCode: 601062,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '数据统计', path: '/admin/report/' },
              { title: '推广大使增长', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/VipIncrease'], r)
        }
      ]
    }]
}
