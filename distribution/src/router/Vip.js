export default {
  path: '/admin/vip',
  redirect: '/admin/vip/center',
  meta: {
    nav: '推广大使',
    icon: 'icon-huiyuan',
    visible: true,
    auth: true,
    authCode: 601060
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 推广大使管理
    {
      path: '/admin/vip/center',
      redirect: '/admin/vip/center/index',
      meta: {
        nav: '推广大使管理',
        icon: 'icon-huiyuanguanli',
        auth: true,
        authCode: 601061
      },
      component: r => require(['@/views/admin/vip/IndexLayout'], r),
      children: [

        // 推广大使管理
        {
          path: '/admin/vip/center/index',
          meta: {
            title: '推广大使管理',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601061,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '推广大使管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/Index'], r)
        },

        // 修改信息
        {
          path: '/admin/vip/center/edit',
          meta: {
            title: '修改信息',
            auth: true,
            authCode: 601061,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '推广大使管理', path: '/admin/vip/center/index' },
              { title: '修改信息', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/Details'], r)
        },

        // 详情
        {
          path: '/admin/vip/center/details',
          meta: {
            title: '详情',
            auth: true,
            authCode: 601061,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '推广大使管理', path: '/admin/vip/center/index' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/Details'], r)
        },

        // 账户升级
        {
          path: '/admin/vip/center/upgrade',
          meta: {
            title: '账户升级',
            auth: true,
            authCode: 601061,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '推广大使管理', path: '/admin/vip/center/index' },
              { title: '账户升级', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/Upgrade'], r)
        }
      ]
    },

    // 升级审核
    {
      path: '/admin/vip/upgrade/audit',
      redirect: '/admin/vip/upgrade/audit/index',
      meta: {
        nav: '升级审核',
        icon: 'icon-huiyuanguanli',
        auth: true,
        authCode: 601062
      },
      component: r => require(['@/views/admin/vip/auditLayout'], r),
      children: [

        // 全部
        {
          path: '/admin/vip/upgrade/audit/index',
          meta: {
            title: '升级审核',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601062,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '升级审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/examineList'], r)
        },

        // 待审核
        {
          path: '/admin/vip/upgrade/audit/stay',
          meta: {
            title: '升级审核',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601062,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '升级审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/examineList'], r)
        },

        // 审核通过
        {
          path: '/admin/vip/upgrade/audit/adopt',
          meta: {
            title: '升级审核',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601062,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '升级审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/examineList'], r)
        },

        // 已打回
        {
          path: '/admin/vip/upgrade/audit/regression',
          meta: {
            title: '升级审核',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601062,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '升级审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/examineList'], r)
        },

        // 详情
        {
          path: '/admin/vip/upgrade/audit/details',
          meta: {
            title: '详情',
            auth: true,
            authCode: 601062,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '升级审核', path: '/admin/vip/center/index' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/examineDetails'], r)
        },

        // 审核
        {
          path: '/admin/vip/upgrade/audit/details',
          meta: {
            title: '审核',
            auth: true,
            authCode: 601062,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '升级审核', path: '/admin/vip/center/index' },
              { title: '审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/examineDetails'], r)
        }
      ]
    },
    // 推荐网络
    {
      path: '/admin/vip/recommendNet',
      redirect: '/admin/vip/recommendNet/index',
      meta: {
        nav: '推荐网络',
        icon: 'icon-huiyuanguanli',
        auth: true,
        authCode: 601062
      },
      component: r => require(['@/views/admin/vip/recommendNetLayout'], r),
      children: [
        {
          path: '/admin/vip/recommendNet/index',
          meta: {
            title: '推荐网络',
            pageBack: true,
            // refresh: false,
            auth: true,
            authCode: 601062,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '推广大使', path: '/admin/vip/' },
              { title: '推荐网络', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vip/RecommendNet.vue'], r)
        }
      ]
    }
  ]
}
