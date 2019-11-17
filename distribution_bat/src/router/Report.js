// 统计报表
export default {
  path: '/admin/report',
  redirect: '/admin/report/list',
  meta: {
    nav: '统计报表',
    icon: 'icon-weibiaoti4',
    auth: true,
    authCode: 601050
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 业绩表
    {
      path: '/admin/report/list',
      redirect: '/admin/report/list/all',
      meta: {
        nav: '业绩表',
        icon: 'icon-yejibaobiao',
        auth: true,
        authCode: 601051
      },
      component: r => require(['@/views/admin/report/IndexLayout'], r),
      children: [

        // 业绩表
        {
          path: '/admin/report/list/all',
          meta: {
            title: '业绩表',
            pageBack: true,
            auth: true,
            authCode: 601051,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '统计报表', path: '/admin/report/' },
              { title: '业绩表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/Index'], r)
        },

        // 查看明细
        {
          path: '/admin/report/list/details',
          meta: {
            title: '业绩表',
            pageBack: true,
            auth: true,
            authCode: 601051,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '统计报表', path: '/admin/report/' },
              { title: '业绩表', path: '/admin/report/list/alls' },
              { title: '查看明细', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/Index'], r)
        }
      ]
    },

    // 业绩排名表
    {
      path: '/admin/report/ranking',
      redirect: '/admin/report/ranking',
      meta: {
        nav: '业绩排名表',
        icon: 'icon-paiming',
        auth: true,
        authCode: 601052,
        visible: true
      },
      component: r => require(['@/views/admin/report/RankingLayout'], r),
      children: [

        // 业绩排名表
        {
          path: '/admin/report/ranking',
          meta: {
            title: '业绩排名表',
            pageBack: true,
            auth: true,
            authCode: 601052,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '统计报表', path: '/admin/report/' },
              { title: '业绩排名表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/Ranking'], r)
        }
      ]
    },

    // 会员账户表
    {
      path: '/admin/report/vip/account',
      redirect: '/admin/report/vip/account',
      meta: {
        nav: '会员账户表',
        icon: 'icon-huiyuanguanli',
        auth: true,
        authCode: 601053,
        visible: true
      },
      component: r => require(['@/views/admin/report/VipLayout'], r),
      children: [

        // 会员账户表
        {
          path: '/admin/report/vip/account',
          meta: {
            title: '会员账户表',
            pageBack: true,
            auth: true,
            authCode: 601053,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '统计报表', path: '/admin/report/' },
              { title: '会员账户表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/VipAccount'], r)
        }
      ]
    },

    // 会员增长表
    {
      path: '/admin/report/vip/increase',
      redirect: '/admin/report/vip/increase',
      meta: {
        nav: '会员增长表',
        icon: 'icon-tianjiayonghu',
        auth: true,
        authCode: 601054,
        visible: true
      },
      component: r => require(['@/views/admin/report/VipLayout'], r),
      children: [

        // 会员增长表
        {
          path: '/admin/report/vip/increase',
          meta: {
            title: '统计报表',
            pageBack: true,
            auth: true,
            authCode: 601054,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '统计报表', path: '/admin/report/' },
              { title: '会员增长表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/VipIncrease'], r)
        }
      ]
    },

    // 业绩统计表
    {
      path: '/admin/report/achievement/list',
      redirect: '/admin/report/achievement/list',
      meta: {
        nav: '业绩统计表',
        icon: 'icon-paiming',
        auth: true,
        authCode: 601055,
        visible: true
      },
      component: r => require(['@/views/admin/report/AchievementLayout'], r),
      children: [

        // 业绩统计表
        {
          path: '/admin/report/achievement/list',
          meta: {
            title: '业绩统计表',
            pageBack: true,
            auth: true,
            authCode: 601055,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '统计报表', path: '/admin/report/' },
              { title: '业绩统计表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/AchievementList'], r)
        }
      ]
    },

    // 销售统计表
    {
      path: '/admin/report/sale/list',
      redirect: '/admin/report/sale/list/all',
      meta: {
        nav: '销售统计表',
        icon: 'icon-yejibaobiao',
        auth: true,
        authCode: 601056
      },
      component: r => require(['@/views/admin/report/IndexLayout'], r),
      children: [

        // 销售统计表
        {
          path: '/admin/report/sale/list',
          meta: {
            title: '销售统计表',
            pageBack: true,
            auth: true,
            authCode: 601056,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '统计报表', path: '/admin/report/' },
              { title: '销售统计表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/SalesStatisticsList'], r)
        }
      ]
    },

    // 账户流水表
    {
      path: '/admin/report/currency',
      redirect: '/admin/report/currency/list',
      meta: {
        title: '账户流水表',
        nav: '账户流水表',
        icon: 'icon-shenhe1',
        auth: true,
        authCode: 601057,
        breadcrumb: [
          { title: '首页', path: '' },
          { title: '通用积分流水表', path: '/admin/report/currency/list' },
          { title: '通用积分流水表', path: '' }
        ]
      },
      component: r => require(['@/views/admin/report/currency/currencyLayout.vue'], r),
      children: [
        // 通用积分流水表
        {
          path: '/admin/report/currency/list',
          meta: {
            title: '通用积分流水表',
            auth: true,
            authCode: 601057,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '账户流水表', path: '/admin/report/currency/list' },
              { title: '通用积分流水表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/currency/currencyList.vue'], r)
        },

        // 现金流水表
        {
          path: '/admin/report/currency/cash',
          meta: {
            title: '现金流水表',
            auth: true,
            authCode: 601057,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '账户流水表', path: '/admin/report/currency/list' },
              { title: '现金流水表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/currency/cashList.vue'], r)
        },

        // 通用积分流水表 - 账户明细
        {
          path: '/admin/report/currency/details',
          meta: {
            title: '账户流水表',
            auth: true,
            visible: true,
            authCode: 601057,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '通用积分流水表', path: '/admin/report/currency/details' },
              { title: '账户明细', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/currency/AccountDetails.vue'], r)
        },

        // 通用积分流水表 - 详情
        {
          path: '/admin/report/currency/list/details',
          meta: {
            title: '账户流水表',
            auth: true,
            visible: true,
            authCode: 601057,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '通用积分流水表', path: '/admin/report/currency/list' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/currency/Details.vue'], r)
        },

         // 现金流水表 - 详情
        {
          path: '/admin/report/currency/cash/details',
          meta: {
            title: '账户流水表',
            auth: true,
            authCode: 601057,
            visible: true,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '现金流水表', path: '/admin/report/currency/cash' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/report/currency/cashDetails.vue'], r)
        }
      ]
    }
  ]
}
